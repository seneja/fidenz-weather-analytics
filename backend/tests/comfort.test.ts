import { describe, it, expect } from 'vitest';
import {
  scoreTemperature,
  scoreHumidity,
  scoreWindSpeed,
  scoreCloudiness
} from '../src/comfort-index/scoring';
import {
  calculateComfortIndex,
  rankCities,
  kelvinToCelsius,
  WeatherData,
  UnrankedCityResult
} from '../src/comfort-index';

describe('Comfort Scoring Parameters', () => {
  it('should score temperature correctly', () => {
    // Ideal temperature
    expect(scoreTemperature(22)).toBe(100);
    // Moderate temperatures
    expect(scoreTemperature(26)).toBe(88); // Close to ideal
    expect(scoreTemperature(18)).toBe(88); // Close to ideal
    // Extreme temperatures
    expect(scoreTemperature(0)).toBe(2);   // Very cold
    expect(scoreTemperature(40)).toBe(8);   // Very hot
  });

  it('should score humidity correctly', () => {
    // Ideal humidity
    expect(scoreHumidity(45)).toBe(100);
    // Moderate humidity
    expect(scoreHumidity(60)).toBe(75);
    expect(scoreHumidity(30)).toBe(75);
    // Extreme humidity
    expect(scoreHumidity(95)).toBe(4);   // Extremely humid
    expect(scoreHumidity(5)).toBe(14);    // Extremely dry
  });

  it('should score wind speed correctly', () => {
    // Ideal wind speed
    expect(scoreWindSpeed(2)).toBe(100);
    // Calm wind
    expect(scoreWindSpeed(0)).toBe(88);  // Quite comfortable still
    // Moderate wind
    expect(scoreWindSpeed(5)).toBe(75);
    // Extreme wind
    expect(scoreWindSpeed(15)).toBe(1);  // High wind
  });

  it('should score cloudiness correctly', () => {
    // Ideal cloudiness
    expect(scoreCloudiness(20)).toBe(100);
    // Clear sky
    expect(scoreCloudiness(0)).toBe(80);
    // Partially cloudy
    expect(scoreCloudiness(50)).toBe(61);
    // Fully overcast
    expect(scoreCloudiness(100)).toBe(3);
  });
});

describe('Combined Comfort Index', () => {
  it('should calculate comfort index for ideal conditions close to 100', () => {
    const idealWeather: WeatherData = {
      temp: 22 + 273.15, // 22°C
      humidity: 45,
      windSpeed: 2,
      clouds: 20,
      pressure: 1013,
      visibility: 10000,
      description: 'Ideal Weather',
    };
    expect(calculateComfortIndex(idealWeather)).toBe(100);
  });

  it('should calculate lower comfort index for suboptimal conditions', () => {
    const harshWeather: WeatherData = {
      temp: 40 + 273.15, // 40°C
      humidity: 90,
      windSpeed: 15,
      clouds: 90,
      pressure: 1005,
      visibility: 5000,
      description: 'Harsh Weather',
    };
    const score = calculateComfortIndex(harshWeather);
    expect(score).toBeLessThan(30);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('City Ranking Logic', () => {
  it('should rank cities correctly by comfort score descending', () => {
    const unranked: UnrankedCityResult[] = [
      { cityId: 1, cityName: 'City A', description: 'desc', tempCelsius: 20, comfortScore: 80 },
      { cityId: 2, cityName: 'City B', description: 'desc', tempCelsius: 20, comfortScore: 95 },
      { cityId: 3, cityName: 'City C', description: 'desc', tempCelsius: 20, comfortScore: 60 },
    ];

    const ranked = rankCities(unranked);

    expect(ranked[0].cityName).toBe('City B');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].cityName).toBe('City A');
    expect(ranked[1].rank).toBe(2);
    expect(ranked[2].cityName).toBe('City C');
    expect(ranked[2].rank).toBe(3);
  });

  it('should resolve ties alphabetically', () => {
    const unranked: UnrankedCityResult[] = [
      { cityId: 1, cityName: 'Z-City', description: 'desc', tempCelsius: 20, comfortScore: 80 },
      { cityId: 2, cityName: 'A-City', description: 'desc', tempCelsius: 20, comfortScore: 80 },
    ];

    const ranked = rankCities(unranked);

    expect(ranked[0].cityName).toBe('A-City');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].cityName).toBe('Z-City');
    expect(ranked[1].rank).toBe(2);
  });
});
