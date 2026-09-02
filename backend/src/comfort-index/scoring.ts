
export function scoreTemperature(tempCelsius: number): number {
  const diff = tempCelsius - 22;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 8, 2)));
}


export function scoreHumidity(humidityPct: number): number {
  const diff = humidityPct - 45;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 20, 2)));
}

export function scoreWindSpeed(windMs: number): number {
  const diff = windMs - 2;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 4, 2)));
}


export function scoreCloudiness(cloudPct: number): number {
  const diff = cloudPct - 20;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 30, 2)));
}

export function scoreVisibility(visibilityMeters: number): number {
  const diff = visibilityMeters - 1000;
  return Math.round(100 * Math.exp(-0.5 * Math.pow(diff / 2000, 2)));
}