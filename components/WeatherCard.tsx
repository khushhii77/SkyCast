
import React from 'react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const getIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sun')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('thunder') || lower.includes('storm')) return '⛈️';
    if (lower.includes('wind')) return '🌬️';
    return '⛅';
  };

  return (
    <div className="w-full max-w-2xl mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        {/* Abstract Background Decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-1">{data.city}</h2>
              <p className="text-slate-400 font-medium capitalize">{data.description}</p>
            </div>
            <div className="text-7xl md:text-8xl">{getIcon(data.condition)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <div className="text-4xl">🌡️</div>
              <div>
                <div className="text-3xl font-bold text-white">{data.temperature}°C</div>
                <div className="text-sm text-slate-400 font-medium">Temperature</div>
                <div className="text-xs text-slate-500 mt-1">H: {data.high}°C / L: {data.low}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <div className="text-4xl">💧</div>
              <div>
                <div className="text-3xl font-bold text-white">{data.humidity}%</div>
                <div className="text-sm text-slate-400 font-medium">Humidity</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <div className="text-4xl">💨</div>
              <div>
                <div className="text-3xl font-bold text-white">{data.windSpeed}</div>
                <div className="text-sm text-slate-400 font-medium">Wind Speed</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <div className="text-4xl">✨</div>
              <div>
                <div className="text-3xl font-bold text-white capitalize">{data.condition}</div>
                <div className="text-sm text-slate-400 font-medium">Condition</div>
              </div>
            </div>
          </div>

          {data.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Sources</h3>
              <div className="flex flex-wrap gap-2">
                {data.sources.slice(0, 3).map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 py-1 px-3 rounded-full border border-slate-700 transition-colors"
                  >
                    {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
