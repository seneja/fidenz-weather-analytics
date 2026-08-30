import { useState, useEffect, useCallback } from 'react';
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

  const fetchWeather = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('/api/weather', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to fetch: ${response.statusText}`);
      }

      const weatherData: WeatherCityResult[] = await response.json();
      setData(weatherData);
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'An unexpected error occurred while loading weather data.');
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, loading, error, refetch: fetchWeather };
};
