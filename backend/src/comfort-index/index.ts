import { scoreTemperature, scoreHumidity, scoreWindSpeed, scoreCloudiness } from './scoring';

export interface WeatherData {
  temp: number; // Temperature in Kelvin
  humidity: number; // Humidity percentage
  windSpeed: number; // Wind speed in m/s
  clouds: number; // Cloudiness percentage
  pressure: number; // Pressure in hPa
  visibility: number; // Visibility in meters
  description: string; // Weather description
}

export interface UnrankedCityResult {
  cityId: number;
  cityName: string;
  description: string;
  tempCelsius: number;
  comfortScore: number;
}

export interface CityComfortResult extends UnrankedCityResult {
  rank: number;
}

/**
 * Converts Kelvin to Celsius and rounds to 2 decimal places.
 */
export function kelvinToCelsius(kelvin: number): number {
  return parseFloat((kelvin - 273.15).toFixed(2));
}

/**
 * Calculates a single comfort index score (0-100) based on weather conditions.
 * Weights:
 * - Temperature: 40%
 * - Humidity: 30%
 * - Wind Speed: 15%
 * - Cloudiness: 15%
 */
export function calculateComfortIndex(weather: WeatherData): number {
  const tempCelsius = kelvinToCelsius(weather.temp);

  const sTemp = scoreTemperature(tempCelsius);
  const sHum = scoreHumidity(weather.humidity);
  const sWind = scoreWindSpeed(weather.windSpeed);
  const sCloud = scoreCloudiness(weather.clouds);

  const score = (sTemp * 0.40) + (sHum * 0.30) + (sWind * 0.15) + (sCloud * 0.15);
  return Math.round(score);
}

/**
 * Sorts cities by comfort score descending (and alphabetically by name as tie-breaker)
 * and assigns a sequential 1-based rank.
 */
export function rankCities(cities: UnrankedCityResult[]): CityComfortResult[] {
  const sorted = [...cities].sort((a, b) => {
    if (b.comfortScore !== a.comfortScore) {
      return b.comfortScore - a.comfortScore;
    }
    return a.cityName.localeCompare(b.cityName);
  });

  return sorted.map((city, index) => ({
    ...city,
    rank: index + 1,
  }));
}
