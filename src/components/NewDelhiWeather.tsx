import { useEffect, useState } from "react";
import { Wind, Droplets, Sun } from "lucide-react";

// Open-Meteo — free, no API key needed
// New Delhi: 28.6139°N, 77.2090°E
const DELHI_LAT = 28.6139;
const DELHI_LON = 77.209;

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
}

function getWeatherLabel(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function getWeatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "⛅" : "🌤️";
  if (code === 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 59) return "🌦️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 86) return "🌨️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

function getUVLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "text-emerald-400" };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-400" };
  if (uv <= 7) return { label: "High", color: "text-orange-400" };
  if (uv <= 10) return { label: "Very High", color: "text-red-400" };
  return { label: "Extreme", color: "text-purple-400" };
}

async function fetchWeather(): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${DELHI_LAT}&longitude=${DELHI_LON}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,weather_code,is_day` +
    `&wind_speed_unit=kmh&timezone=Asia%2FKolkata`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  const c = json.current;
  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m),
    uvIndex: Math.round(c.uv_index),
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
  };
}

interface Props {
  /** compact=true → single-line pill for the navbar */
  compact?: boolean;
}

const NewDelhiWeather = ({ compact = false }: Props) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    try {
      const data = await fetchWeather();
      setWeather(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || error || !weather) return null;

  const uv = getUVLabel(weather.uvIndex);
  const emoji = getWeatherEmoji(weather.weatherCode, weather.isDay);
  const label = getWeatherLabel(weather.weatherCode);

  // ── COMPACT pill for the navbar ──────────────────────────────────────────
  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-secondary/50 hover:border-neon/30 transition-all duration-300 cursor-default select-none"
        title={`New Delhi — Feels like ${weather.feelsLike}°C · ${weather.humidity}% humidity · Wind ${weather.windSpeed} km/h · UV ${uv.label}`}
      >
        <span className="text-base leading-none">{emoji}</span>
        <span className="font-display font-bold text-sm text-foreground">
          {weather.temp}°C
        </span>
        <span className="text-[11px] text-muted-foreground inline">
          {label}
        </span>
        <span className="w-px h-3 bg-border mx-0.5 block" />
        <span className="text-[11px] text-muted-foreground inline">
          Delhi
        </span>
      </div>
    );
  }

  // ── FULL card (kept for reuse elsewhere) ─────────────────────────────────
  return (
    <div className="group flex items-center gap-3 bg-secondary/60 border border-border rounded-xl px-3 py-2.5 hover:border-neon/30 transition-all duration-300 max-w-[260px]">
      <div className="flex-shrink-0 text-3xl leading-none select-none">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground mb-0.5">New Delhi, IN</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-foreground group-hover:text-neon transition-colors">
            {weather.temp}°C
          </span>
          <span className="text-[10px] text-muted-foreground truncate">{label}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Droplets className="w-2.5 h-2.5" />{weather.humidity}%
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Wind className="w-2.5 h-2.5" />{weather.windSpeed} km/h
          </span>
          <span className="flex items-center gap-0.5 text-[10px]">
            <Sun className="w-2.5 h-2.5 text-muted-foreground" />
            <span className={uv.color}>{uv.label}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewDelhiWeather;
