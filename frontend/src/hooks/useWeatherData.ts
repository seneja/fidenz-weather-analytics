import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export interface WeatherCityResult {
  cityId: number;
  cityName: string;
  description: string;
  tempCelsius: number;
  comfortScore: number;
  rank: number;
}

export const useWeatherData = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [data, setData] = useState<WeatherCityResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Use a counter trigger so refetch always creates a fresh fetch cycle
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('/api/weather', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cancelled) return;

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized access. Please log in again.');
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to fetch: ${response.statusText}`);
        }

        const weatherData: WeatherCityResult[] = await response.json();
        if (!cancelled) {
          setData(weatherData);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('Error fetching weather data:', err);
          setError(err.message || 'An unexpected error occurred while loading weather data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, fetchTrigger]);

  const refetch = useCallback(() => {
    setFetchTrigger(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
};
