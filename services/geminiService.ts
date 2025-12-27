import { WeatherData } from '../types';

// Helper to map Open-Meteo WMO Codes to human-readable strings
const getConditionFromCode = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Mainly clear / Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 99) return "Thunderstorm";
  return "Variable";
};

/**
 * Fetches coordinates for a city name, then fetches weather.
 */
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  // Use const to define the variable properly
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  
  try {
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error("Geocoding service unavailable");
    
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please check the spelling.");
    }

    const { latitude, longitude, name } = geoData.results[0];
    
    // Pass the found coordinates to the next function
    return await fetchWeatherByCoords(latitude, longitude, name);
  } catch (error: any) {
    throw new Error(error.message || "An error occurred while searching for the city.");
  }
};

/**
 * Fetches high-resolution weather data using latitude and longitude.
 */
export const fetchWeatherByCoords = async (lat: number, lon: number, cityName?: string): Promise<WeatherData> => {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error("Weather service unavailable");
    
    const data = await response.json();

    // Mapping to your existing WeatherData interface
    return {
      city: cityName || "Current Location",
      temperature: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      condition: getConditionFromCode(data.current.weather_code),
      description: "Atmospheric data grounded by local meteorological models.",
      windSpeed: `${data.current.wind_speed_10m} km/h`,
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      sources: [{ title: "Open-Meteo", uri: "https://open-meteo.com/" }]
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch data for these coordinates.");
  }
};