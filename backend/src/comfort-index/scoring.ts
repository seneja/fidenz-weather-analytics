/**
 * Scores temperature based on its distance from the ideal temperature (22°C).
 * Uses a Gaussian decay curve with a standard deviation of 8°C.
 */
export function scoreTemperature(tempCelsius: number): number {
  const diff = tempCelsius - 22;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 8, 2)));
}

/**
 * Scores humidity based on its distance from the ideal relative humidity (45%).
 * Uses a Gaussian decay curve with a standard deviation of 20%.
 */
export function scoreHumidity(humidityPct: number): number {
  const diff = humidityPct - 45;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 20, 2)));
}

/**
 * Scores wind speed based on its distance from the ideal wind speed (2 m/s).
 * Uses a Gaussian decay curve with a standard deviation of 4 m/s.
 */
export function scoreWindSpeed(windMs: number): number {
  const diff = windMs - 2;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 4, 2)));
}

/**
 * Scores cloudiness based on its distance from the ideal cloud cover (20%).
 * Uses a Gaussian decay curve with a standard deviation of 30%.
 */
export function scoreCloudiness(cloudPct: number): number {
  const diff = cloudPct - 20;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 30, 2)));
}
