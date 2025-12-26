
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Provide the current weather for ${city}. 
    I need: 
    1. Temperature in Celsius (number only).
    2. Humidity percentage (number only).
    3. General weather condition (e.g., "Clear", "Cloudy", "Rain", "Snow", "Storm").
    4. A short description of the weather.
    5. Wind speed with units.
    6. Today's high and low temperatures in Celsius.
    
    Return the data strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            temperature: { type: Type.NUMBER },
            humidity: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            description: { type: Type.STRING },
            windSpeed: { type: Type.STRING },
            high: { type: Type.NUMBER },
            low: { type: Type.NUMBER },
          },
          required: ["city", "temperature", "humidity", "condition", "description", "windSpeed", "high", "low"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Extract sources from grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      ...result,
      sources
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Failed to fetch weather data. Please try again.");
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Provide the current weather for the location at coordinates: Latitude ${lat}, Longitude ${lon}.
    Identify the city or nearest location name.
    I need: 
    1. City name.
    2. Temperature in Celsius (number only).
    3. Humidity percentage (number only).
    4. General weather condition (e.g., "Clear", "Cloudy", "Rain", "Snow", "Storm").
    5. A short description of the weather.
    6. Wind speed with units.
    7. Today's high and low temperatures in Celsius.
    
    Return the data strictly in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            temperature: { type: Type.NUMBER },
            humidity: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            description: { type: Type.STRING },
            windSpeed: { type: Type.STRING },
            high: { type: Type.NUMBER },
            low: { type: Type.NUMBER },
          },
          required: ["city", "temperature", "humidity", "condition", "description", "windSpeed", "high", "low"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      ...result,
      sources
    };
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
    throw new Error("Failed to fetch location weather.");
  }
};
