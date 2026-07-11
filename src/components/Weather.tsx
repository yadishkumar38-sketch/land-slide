import React, { useState, useEffect } from "react";
import { CloudRain, Thermometer, Droplets, Wind, AlertTriangle, ShieldCheck, Play, Square, Loader2, CloudLightning } from "lucide-react";
import { WeatherState } from "../types";

interface WeatherProps {
  weather: WeatherState;
  onWeatherChange: (newWeather: WeatherState) => void;
  onTriggerEmergency: (msg: string) => void;
}

export default function Weather({ weather, onWeatherChange, onTriggerEmergency }: WeatherProps) {
  const [isSimulatingStorm, setIsSimulatingStorm] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // Storm Simulation Loop
  useEffect(() => {
    let interval: any = null;

    if (isSimulatingStorm) {
      interval = setInterval(() => {
        setSimulationStep((prev) => {
          const nextStep = prev + 1;
          
          if (nextStep <= 10) {
            // Smoothly ramp up storm metrics
            const fraction = nextStep / 10;
            const updatedWeather: WeatherState = {
              condition: "Severe Torrential Storm",
              temp: Math.round(24 - (3 * fraction)), // Temp drops slightly
              humidity: Math.round(75 + (25 * fraction)), // Humidity rises to 100%
              windSpeed: Math.round(12 + (55 * fraction)), // Wind speeds up to 67 km/h
              rainfallLevel: Math.round(5 + (135 * fraction)), // Rainfall spikes up to 140mm
              weatherRiskScore: Math.round(12 + (83 * fraction)), // Slope saturation spikes to 95%
              prediction: "⚠️ CATASTROPHIC SLOPE SATURATION IMMINENT. The water volume absorbed by the topsoil has exceeded liquid limit thresholds. Shear strength of slope has decayed by 85%. Ground failure or major mudslide is highly likely within hours."
            };
            onWeatherChange(updatedWeather);

            // Once we cross critical risk (say 80%), fire the emergency alert!
            if (updatedWeather.weatherRiskScore >= 80) {
              onTriggerEmergency("SEVERE MONSOON DEBRIS hazard! Active mudflows forming on west ridges. Liquid saturation levels exceeded.");
            }

            return nextStep;
          } else {
            // Sustain storm
            return prev;
          }
        });
      }, 800);
    } else if (simulationStep > 0) {
      // Smoothly ramp down/reset storm
      interval = setInterval(() => {
        setSimulationStep((prev) => {
          const nextStep = prev - 1;
          if (nextStep >= 0) {
            const fraction = nextStep / 10;
            const restoredWeather: WeatherState = {
              condition: nextStep === 0 ? "Partly Cloudy" : "Rain Diminishing",
              temp: Math.round(21 + (3 * fraction)),
              humidity: Math.round(62 + (38 * fraction)),
              windSpeed: Math.round(8 + (59 * fraction)),
              rainfallLevel: Math.round(2 + (138 * fraction)),
              weatherRiskScore: Math.round(5 + (90 * fraction)),
              prediction: nextStep === 0 
                ? "Stable conditions. Soil moisture is at normal holding capacities with minimal geological risks."
                : "Slope moisture saturation returning to stable holds. Exercise caution near stream banks."
            };
            onWeatherChange(restoredWeather);
            return nextStep;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 600);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingStorm, simulationStep]);

  const toggleSimulation = () => {
    setIsSimulatingStorm(!isSimulatingStorm);
  };

  const getRiskColor = (score: number) => {
    if (score < 35) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    if (score < 70) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
    return "text-red-500 border-red-500/20 bg-red-500/5";
  };

  return (
    <div className="space-y-6">
      {/* Simulation Launcher banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 dark:from-blue-950/20 dark:to-indigo-950/5 border border-blue-500/20 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-blue-500 animate-pulse" />
            Extreme Geological Stress Test
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xl">
            Simulate a catastrophic high-rainfall monsoon storm event in real-time to test how soil absorption and geological warning algorithms respond.
          </p>
        </div>

        <button
          onClick={toggleSimulation}
          className={`mt-4 md:mt-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl ${
            isSimulatingStorm
              ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/15"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/15"
          }`}
        >
          {isSimulatingStorm ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              Cease Storm Simulation
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Simulate Severe Typhoon
            </>
          )}
        </button>
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Metrics Dashboard */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Rainfall level */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <CloudRain className="w-6 h-6" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Rainfall Intensity</span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {weather.rainfallLevel} <span className="text-sm font-medium">mm/hr</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">
                {weather.rainfallLevel > 90 ? "Extreme Torrential Storm" : weather.rainfallLevel > 20 ? "Heavy Monsoon Rain" : "Negligible Moisture Precipitation"}
              </p>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
              <Thermometer className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Ambient Temp</span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {weather.temp}°C
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                Atmospheric thermal levels
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500 shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Relative Humidity</span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {weather.humidity}%
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                Air water-vapour concentrations
              </p>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
              <Wind className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Wind Velocities</span>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {weather.windSpeed} <span className="text-sm font-medium">km/h</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                Velocity vectors exerting lateral force
              </p>
            </div>
          </div>

          {/* Detailed Saturation and Runoff predictions */}
          <div className="sm:col-span-2 bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
              Soil Hydrological Load Profile
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-500 dark:text-zinc-400">Pore Water Pressure Index</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {Math.round(weather.weatherRiskScore * 1.1)} kPa
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500" 
                    style={{ width: `${weather.weatherRiskScore}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-gray-500 dark:text-zinc-400">Topsoil Hydro-Shear Factor</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {Math.max(5, Math.round(100 - (weather.weatherRiskScore * 0.85)))} GPa
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.max(5, 100 - (weather.weatherRiskScore * 0.85))}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* AI Prediction Saturation Dial */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
              AI Moisture Risk Analysis
            </h3>

            {/* Circular Risk Progress Dial */}
            <div className="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
              {/* Dial Circle Backdrop */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-100 dark:text-zinc-800"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={464}
                  strokeDashoffset={464 - (464 * weather.weatherRiskScore) / 100}
                  className={`transition-all duration-500 ${
                    weather.weatherRiskScore < 35 
                      ? "text-emerald-500" 
                      : weather.weatherRiskScore < 70 
                        ? "text-amber-500" 
                        : "text-red-500"
                  }`}
                />
              </svg>

              {/* Centered Values */}
              <div className="text-center space-y-1">
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {weather.weatherRiskScore}%
                </span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                  SATURATION
                </span>
              </div>
            </div>

            {/* Status indicators */}
            <div className={`border p-3 rounded-xl text-xs font-semibold text-center transition-colors ${getRiskColor(weather.weatherRiskScore)}`}>
              {weather.weatherRiskScore < 35 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  SLOPE INTEGRITY: STABLE
                </span>
              ) : weather.weatherRiskScore < 70 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
                  SLOPE INTEGRITY: MODERATE CAUTION
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                  SLOPE INTEGRITY: CRITICAL WARNING
                </span>
              )}
            </div>
          </div>

          {/* AI Explanation block */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-mono">
              Model Diagnostic Output
            </span>
            <p className="text-xs text-gray-600 dark:text-zinc-300 mt-1.5 leading-relaxed">
              {weather.prediction}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
