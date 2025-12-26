
export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  description: string;
  windSpeed: string;
  high: number;
  low: number;
  sources: { title: string; uri: string }[];
}

export enum WeatherType {
  CLEAR = 'Clear',
  CLOUDY = 'Cloudy',
  RAIN = 'Rain',
  SNOW = 'Snow',
  STORM = 'Storm',
  DEFAULT = 'Default'
}
