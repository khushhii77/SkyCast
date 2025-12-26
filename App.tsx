
import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity, fetchWeatherByCoords } from './services/geminiService';
import { WeatherData } from './types';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || "Failed to find that city. Please check the spelling.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoords(latitude, longitude);
          setWeather(data);
        } catch (err: any) {
          setError("Failed to fetch weather for your current location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permission to access location was denied.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    handleSearch('London');
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center p-6 md:p-12 selection:bg-blue-500/30">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <header className="text-center mb-10 w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Sky<span className="text-blue-500">Cast</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini 3</p>
          </div>
          <button 
            onClick={handleLocationClick}
            disabled={loading}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 text-blue-400 rounded-2xl border border-slate-700/50 transition-all active:scale-95 disabled:opacity-50"
            title="Use my location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} isLoading={loading} />

      {error && (
        <div className="mt-6 w-full max-w-xl p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="w-full flex justify-center">
        {loading && !weather ? (
          <div className="mt-24 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-blue-500/50">
                <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 font-medium animate-pulse tracking-wide">Syncing with satellites...</p>
          </div>
        ) : weather && (
          <WeatherCard data={weather} />
        )}
      </div>

      <footer className="mt-auto pt-12 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        &copy; {new Date().getFullYear()} SkyCast AI &bull; Meteorological Data Grounded by Google
      </footer>
    </div>
  );
};

export default App;
