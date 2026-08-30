import axios from 'axios';
import citiesData from '../cities.json';
import { weatherCache } from '../cache';
import { WeatherData, UnrankedCityResult, CityComfortResult, calculateComfortIndex, rankCities, kelvinToCelsius } from '../comfort-index';

export interface CityEntry {
  id: number;
  name: string;
}

const cities: CityEntry[] = (citiesData as { List: Array<{ CityCode: string; CityName: string }> }).List.map(city => ({
  id: parseInt(city.CityCode, 10),
  name: city.CityName,
}));

/**
 * Fetches weather for a single city, checking cache first.
 */
async function fetchCityWeather(cityId: number, cityName: string): Promise<UnrankedCityResult> {
  const cached = weatherCache.get(cityId);
  if (cached) {
    const tempCelsius = kelvinToCelsius(cached.temp);
    const comfortScore = calculateComfortIndex(cached);
    return {
      cityId,
      cityName,
      description: cached.description,
      tempCelsius,
      comfortScore,
    };
  }

  const apiKey = process.env.OWM_API_KEY;
  if (!apiKey) {
    throw new Error('OWM_API_KEY environment variable is not defined');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}`;
  const response = await axios.get(url);

  const data = response.data;
  const weather: WeatherData = {
    temp: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    clouds: data.clouds.all,
    pressure: data.main.pressure,
    visibility: data.visibility || 10000,
    description: data.weather[0]?.description || 'No description',
  };

  weatherCache.set(cityId, weather);

  const tempCelsius = kelvinToCelsius(weather.temp);
  const comfortScore = calculateComfortIndex(weather);

  return {
    cityId,
    cityName,
    description: weather.description,
    tempCelsius,
    comfortScore,
  };
}

export async function getRankedWeather(): Promise<CityComfortResult[]> {
  const promises = cities.map(city => fetchCityWeather(city.id, city.name));
  const results = await Promise.allSettled(promises);

  const unrankedResults: UnrankedCityResult[] = results.map((res, index) => {
    const city = cities[index];
    if (res.status === 'fulfilled') {
      return res.value;
    } else {
      console.error(`Failed to fetch weather for ${city.name}:`, res.reason);
      return {
        cityId: city.id,
        cityName: city.name,
        description: `Error: Unable to fetch weather (${res.reason?.message || 'Unknown error'})`,
        tempCelsius: 0,
        comfortScore: 0,
      };
    }
  });

  return rankCities(unrankedResults);
}

export function getCacheDebugInfo() {
  return cities.map(city => weatherCache.getDebugInfo(city.id));
}
