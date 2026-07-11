import React from "react";
import { Compass, ShieldAlert, Sun, Moon, Home, LayoutDashboard, Sparkles, Map, CloudRain, Database, Phone, CheckCircle } from "lucide-react";
import { AppTab } from "../types";

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeAlarm: boolean;
  onTriggerAlarmScreen: () => void;
}

export default function Navbar({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
  activeAlarm,
  onTriggerAlarmScreen,
}: NavbarProps) {
  
  // Navigation elements
  const navItems = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "analysis", label: "Analysis Studio", icon: <Sparkles className="w-4 h-4" /> },
    { id: "map", label: "Live Risk Map", icon: <Map className="w-4 h-4" /> },
    { id: "weather", label: "Weather", icon: <CloudRain className="w-4 h-4" /> },
    { id: "database", label: "Historical Logs", icon: <Database className="w-4 h-4" /> },
    { id: "contact", label: "Support", icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onTabChange("home")}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-black tracking-widest text-gray-900 dark:text-white block uppercase">
                SlopeSentinel <span className="text-emerald-500 font-extrabold font-mono text-xs">AI</span>
              </span>
              <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                Geological Hazard Mesh
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as AppTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-zinc-900 dark:bg-zinc-800 text-white shadow-sm"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Utility Buttons: Dark Mode / Critical Alarm / Mobile trigger */}
          <div className="flex items-center gap-2">
            
            {/* Blinking Critical Alarm Warning Tag */}
            {activeAlarm && (
              <button
                onClick={onTriggerAlarmScreen}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-red-600/15 animate-pulse transition-transform active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 animate-bounce" />
                Evacuation Alert
              </button>
            )}

            {/* Dark Mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-xl flex items-center justify-center border border-gray-100 dark:border-zinc-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-zinc-600" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer Overlay (Single compact strip) */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-gray-100 dark:border-zinc-900 overflow-x-auto gap-2 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as AppTab)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase shrink-0 transition-colors ${
                  isActive
                    ? "bg-zinc-900 dark:bg-zinc-800 text-white"
                    : "text-gray-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                }`}
              >
                {item.icon}
                {item.label.split(" ")[0]}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
}
