import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Analysis from "./components/Analysis";
import RiskMap from "./components/RiskMap";
import Weather from "./components/Weather";
import Database from "./components/Database";
import Contact from "./components/Contact";
import EmergencyAlert from "./components/EmergencyAlert";
import { AppTab, HillAnalysis, WeatherState } from "./types";
import { Compass, ShieldCheck, Heart } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [darkMode, setDarkMode] = useState(true);
  const [activeAlarm, setActiveAlarm] = useState(false);
  const [alarmMessage, setAlarmMessage] = useState("");

  // Track geological scans locally
  const [analysesList, setAnalysesList] = useState<HillAnalysis[]>([]);

  // Track weather telemetry
  const [weather, setWeather] = useState<WeatherState>({
    condition: "Partly Cloudy",
    temp: 21,
    humidity: 62,
    windSpeed: 8,
    rainfallLevel: 2,
    weatherRiskScore: 5,
    prediction: "Stable conditions. Soil moisture is at normal holding capacities with minimal geological risks."
  });

  // Track mock user location (X, Y inside our 100x100 grid)
  const [userLocation, setUserLocation] = useState({
    x: 55,
    y: 42,
    name: "Summit Foothill Trails"
  });

  // Manage Dark / Light Mode document classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddAnalysis = (newAnalysis: HillAnalysis) => {
    setAnalysesList((prev) => [newAnalysis, ...prev]);
  };

  const handleTriggerEmergency = (message: string) => {
    setAlarmMessage(message);
    setActiveAlarm(true);
  };

  const handleUserLocationChange = (x: number, y: number, name: string) => {
    setUserLocation({ x, y, name });
  };

  // Render sub-components based on active tab state
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onNavigateTab={setActiveTab} />;
      case "dashboard":
        return (
          <Dashboard
            analysesList={analysesList}
            weather={weather}
            activeAlarm={activeAlarm}
            onNavigateTab={setActiveTab}
          />
        );
      case "analysis":
        return (
          <Analysis
            onAddAnalysis={handleAddAnalysis}
            onTriggerEmergency={handleTriggerEmergency}
          />
        );
      case "map":
        return (
          <RiskMap
            userLocation={userLocation}
            onUserLocationChange={handleUserLocationChange}
            activeHighRisk={activeAlarm}
          />
        );
      case "weather":
        return (
          <Weather
            weather={weather}
            onWeatherChange={setWeather}
            onTriggerEmergency={handleTriggerEmergency}
          />
        );
      case "database":
        return <Database />;
      case "contact":
        return <Contact />;
      default:
        return <Home onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeAlarm={activeAlarm}
        onTriggerAlarmScreen={() => setActiveAlarm(true)}
      />

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {renderTabContent()}
      </main>

      {/* Full-Screen Evacuation Alarm Overlay */}
      <EmergencyAlert
        isOpen={activeAlarm}
        onClose={() => setActiveAlarm(false)}
        message={alarmMessage}
        locationName={userLocation.name}
      />

      {/* System Footer block */}
      <footer className="border-t border-gray-100 dark:border-zinc-900/60 bg-white/40 dark:bg-zinc-950/40 py-10 text-center text-xs text-gray-500 dark:text-zinc-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-1.5 font-bold tracking-widest text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-mono">
            <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            SlopeSentinel Active Geological Sentinel Network
          </div>
          <p className="max-w-md mx-auto text-gray-400 dark:text-zinc-500 leading-relaxed">
            SlopeSentinel uses vision-trained computer intelligence models paired with real-time moisture logging to assess geological hazards. Designed to support community safety.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 dark:text-zinc-500 pt-2 border-t border-gray-100 dark:border-zinc-900/40 max-w-xs mx-auto">
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>Community Security Engineering © 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
