import React from "react";
import { Sparkles, Activity, CloudRain, MapPin, Database, ShieldAlert, Compass, ChevronRight } from "lucide-react";

interface HomeProps {
  onNavigateTab: (tab: any) => void;
}

export default function Home({ onNavigateTab }: HomeProps) {
  
  // Highlight feature list
  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      title: "AI Image Analysis",
      desc: "Instant computer vision evaluations of cliffside photographs using Gemini AI to detect fissures and earth shifts."
    },
    {
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      title: "Hill Condition Detection",
      desc: "Continuous slope monitoring measuring displacement friction angles and rock cleavage fractures."
    },
    {
      icon: <CloudRain className="w-5 h-5 text-teal-500" />,
      title: "Weather Monitoring",
      desc: "Live rainfall velocity sensor networks capturing soil pore-water log ratings and saturation indexes."
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-500" />,
      title: "GPS Location Tracking",
      desc: "Calculates precise user grid alignment vectors relative to designated geological slip hazards."
    },
    {
      icon: <Database className="w-5 h-5 text-amber-500" />,
      title: "Historical Landslide Database",
      desc: "Fully searchable and cataloged records of regional geological slumps, casualties, and mud triggers."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      title: "Instant Emergency Alerts",
      desc: "Automated high-decibel audio sirens and civil warnings triggered immediately when slope parameters collapse."
    },
    {
      icon: <Compass className="w-5 h-5 text-purple-500" />,
      title: "Safe Evacuation Guidance",
      desc: "Dynamic routing paths directing residents toward structurally fortified community refugee shelters."
    }
  ];

  return (
    <div className="space-y-16 py-4">
      
      {/* Hero Section with custom vector peaks background */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[460px] flex items-center justify-center p-8 md:p-12 shadow-xl border border-zinc-800">
        
        {/* Mountain Contour SVG Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400" preserveAspectRatio="none">
            {/* Mountain peak back */}
            <polygon points="10,100 45,30 80,100" fill="currentColor" opacity="0.3" />
            {/* Mountain peak front */}
            <polygon points="30,100 65,45 100,100" fill="currentColor" opacity="0.5" />
            {/* Ridge contour waves */}
            <path d="M 0,80 Q 25,65 50,78 T 100,70 L 100,100 L 0,100 Z" fill="#047857" opacity="0.4" />
          </svg>
        </div>

        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Earth Sentinel Net Active
          </span>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            AI-Based Landslide Detection & <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Early Warning System</span>
          </h1>

          <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Protecting lives through Artificial Intelligence, Weather Monitoring, and Real-Time Alerts. Monitor hill hazards, evaluate slope snapshots, and trace safe evacuation paths instantly.
          </p>

          {/* Core Action Call buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
            <button
              onClick={() => onNavigateTab("analysis")}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 transition-all text-white font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-1.5"
            >
              Check Hill Condition
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab("map")}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 transition-all text-zinc-100 font-bold py-3 px-6 rounded-xl text-xs border border-zinc-700 tracking-wider uppercase flex items-center justify-center gap-1.5"
            >
              View Live Risk Map
            </button>
            <button
              onClick={() => onNavigateTab("contact")}
              className="w-full sm:w-auto bg-transparent hover:bg-white/5 transition-all text-zinc-300 font-semibold py-3 px-6 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-1.5"
            >
              Emergency Information
            </button>
          </div>
        </div>
      </section>

      {/* Features Overview Cards Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Comprehensive Geological Warning Mesh
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Unifying advanced computer vision heuristics with real-time moisture telemetry to preserve structural and human safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-md group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center border border-gray-100 dark:border-zinc-800 group-hover:bg-slate-100 dark:group-hover:bg-zinc-900 transition-colors shrink-0">
                  {item.icon}
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
