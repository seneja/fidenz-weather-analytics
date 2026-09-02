import { scoreTemperature, scoreHumidity, scoreWindSpeed, scoreCloudiness, scoreVisibility } from './scoring';

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
  pressure: number;
  visibility: number;
  description: string;
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


export function kelvinToCelsius(kelvin: number): number {
  return parseFloat((kelvin - 273.15).toFixed(2));
}


export function calculateComfortIndex(weather: WeatherData): number {
  const tempCelsius = kelvinToCelsius(weather.temp);

  const sTemp = scoreTemperature(tempCelsius);
  const sHum = scoreHumidity(weather.humidity);
  const sWind = scoreWindSpeed(weather.windSpeed);
  const sCloud = scoreCloudiness(weather.clouds);
  const sVisibility = scoreVisibility(weather.visibility);
  const score = (sTemp * 0.35) + (sHum * 0.25) + (sWind * 0.15) + (sCloud * 0.10) + (sVisibility * 0.15);
  return Math.round(score);
}


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
