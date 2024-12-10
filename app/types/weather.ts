export type Weather = {
  description: string;
  temperature: number;
  wind: number;
  humidity: number;
};

export type Forecast = {
  evolution: string;
  temperatureTrend: string;
  barometricTrend: string;
  windScale: number;
};