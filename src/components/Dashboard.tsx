import React from "react";
import { Activity, ShieldCheck, AlertTriangle, CloudLightning, FileText, CheckCircle, Clock, Thermometer, UserCheck } from "lucide-react";
import { HillAnalysis, WeatherState } from "../types";

interface DashboardProps {
  analysesList: HillAnalysis[];
  weather: WeatherState;
  activeAlarm: boolean;
  onNavigateTab: (tab: any) => void;
}

export default function Dashboard({ analysesList, weather, activeAlarm, onNavigateTab }: DashboardProps) {
  // Aggregate stats
  const totalAnalyzed = 14 + analysesList.length; // 14 mock historical ones + current list
  const activeAlerts = activeAlarm ? 1 : 0;
  
  // Calculate counts
  const highRiskCount = analysesList.filter(a => a.safetyLevel === "High Risk").length + 2; // + historical mock
  const moderateRiskCount = analysesList.filter(a => a.safetyLevel === "Moderate Risk").length + 4;
  const safeCount = totalAnalyzed - highRiskCount - moderateRiskCount;

  // Recent analyses combined mock + real
  const baseRecent: HillAnalysis[] = [
    {
      id: "rc-1",
      imageName: "East Cliff Face.jpg",
      imageUrl: "",
      timestamp: "Today, 10:45 AM",
      riskPercentage: 12,
      confidenceScore: 91,
      safetyLevel: "Safe",
      detectedIssues: [],
      explanation: "Lush vegetation and bedrock integrity remain fully supportive."
    },
    {
      id: "rc-2",
      imageName: "Summit Housing Sector.jpg",
      imageUrl: "",
      timestamp: "Yesterday, 04:12 PM",
      riskPercentage: 84,
      confidenceScore: 95,
      safetyLevel: "High Risk",
      detectedIssues: ["deep ground cracks", "leaning trees"],
      explanation: "Significant earth movement detected on steep housing slopes."
    }
  ];

  const mergedRecent = [...analysesList, ...baseRecent].slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Hills Analyzed */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-zinc-700 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Hills Analyzed</span>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{totalAnalyzed}</div>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Total geological scans</p>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Active Alerts */}
        <div className={`bg-white dark:bg-zinc-900/60 backdrop-blur border p-6 rounded-2xl shadow-sm transition-all flex items-start justify-between ${
          activeAlarm 
            ? "border-red-500 bg-red-500/5 dark:bg-red-950/10" 
            : "border-gray-100 dark:border-zinc-800"
        }`}>
          <div className="space-y-2">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Active Alerts</span>
            <div className={`text-3xl font-black ${activeAlarm ? "text-red-500 animate-pulse" : "text-gray-900 dark:text-white"}`}>
              {activeAlerts}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Critical evacuation alarms</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeAlarm ? "bg-red-500/20 text-red-500" : "bg-gray-100 dark:bg-zinc-800 text-gray-400"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Safe Locations */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-zinc-700 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Stable Zones</span>
            <div className="text-3xl font-black text-emerald-500">{safeCount}</div>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Low hazard terrains</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Weather Risk */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-zinc-700 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider block">Weather Risk</span>
            <div className={`text-3xl font-black ${
              weather.weatherRiskScore < 35 
                ? "text-emerald-500" 
                : weather.weatherRiskScore < 70 
                  ? "text-amber-500" 
                  : "text-red-500"
            }`}>
              {weather.weatherRiskScore}%
            </div>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">Rainfall moisture index</p>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <CloudLightning className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Grid: Analytical Chart + Recent Scans */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Weekly Scan Analytics Graph */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Chronological Scanning Heuristics</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Geological scanning volume and mean landslide hazard trends.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>

          {/* Interactive responsive SVG Trend Chart */}
          <div className="h-64 flex items-end relative pt-4 select-none">
            {/* Grid axis lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-gray-100 dark:border-zinc-800/60 pointer-events-none" />
            <div className="absolute inset-x-0 top-2/4 border-b border-gray-100 dark:border-zinc-800/60 pointer-events-none" />
            <div className="absolute inset-x-0 top-3/4 border-b border-gray-100 dark:border-zinc-800/60 pointer-events-none" />

            <svg viewBox="0 0 100 36" className="w-full h-full overflow-visible">
              {/* Area filled gradient */}
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d="M 5,30 L 5,16 Q 18,12 32,24 T 60,10 T 80,18 T 95,14 L 95,30 Z"
                fill="url(#chart-grad)"
              />

              {/* Trend lines */}
              <path
                d="M 5,16 Q 18,12 32,24 T 60,10 T 80,18 T 95,14"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.8"
                className="drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
              />

              {/* Risk Score dotted trend */}
              <path
                d="M 5,28 Q 20,24 35,16 T 65,22 T 85,8 T 95,6"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.6"
                strokeDasharray="1.5,1.5"
              />

              {/* Data Node dots */}
              <circle cx="5" cy="16" r="1" fill="#2563eb" />
              <circle cx="32" cy="24" r="1" fill="#2563eb" />
              <circle cx="60" cy="10" r="1" fill="#2563eb" />
              <circle cx="95" cy="14" r="1" fill="#2563eb" />

              {/* X Axis Labels */}
              <text x="5" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">07/03</text>
              <text x="20" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">07/04</text>
              <text x="35" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">07/05</text>
              <text x="50" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">07/06</text>
              <text x="65" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">07/07</text>
              <text x="80" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">07/08</text>
              <text x="95" y="34" className="fill-gray-400 dark:fill-zinc-600 text-[2px] font-semibold" textAnchor="middle">Today</text>
            </svg>
          </div>

          {/* Graph Legend indicators */}
          <div className="flex items-center gap-4 border-t border-gray-100 dark:border-zinc-800 pt-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Geological Scanning Volume
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400">
              <span className="w-2.5 h-2.5 rounded bg-red-500 border border-red-400 border-dashed" />
              Slope Water Logging Level (Mean)
            </span>
          </div>
        </div>

        {/* Recent AI analyses List feed */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent AI Diagnostics</h3>
              <button 
                onClick={() => onNavigateTab("analysis")}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Launch scan
              </button>
            </div>

            <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-1">
              {mergedRecent.map((analysis) => (
                <div 
                  key={analysis.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50/50 dark:bg-zinc-950/25 border border-gray-100 dark:border-zinc-800 rounded-xl"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Diagnostic color side strip */}
                    <div className={`w-1.5 h-9 rounded-full shrink-0 ${
                      analysis.safetyLevel === "Safe" 
                        ? "bg-emerald-500" 
                        : analysis.safetyLevel === "Moderate Risk" 
                          ? "bg-amber-500" 
                          : "bg-red-500"
                    }`} />

                    <div className="space-y-0.5 overflow-hidden">
                      <span className="text-xs font-bold text-gray-900 dark:text-white block truncate">
                        {analysis.imageName}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        {analysis.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-gray-900 dark:text-white block">
                      {analysis.riskPercentage}%
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                      analysis.safetyLevel === "Safe" 
                        ? "text-emerald-500" 
                        : analysis.safetyLevel === "Moderate Risk" 
                          ? "text-amber-500" 
                          : "text-red-500"
                    }`}>
                      {analysis.safetyLevel.split(" ")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("analysis")}
            className="w-full mt-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 dark:border-zinc-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Analyze New Slope Image
          </button>
        </div>

      </div>

      {/* Safety System Checks checklist */}
      <div className="p-6 bg-white dark:bg-zinc-900/60 backdrop-blur rounded-2xl border border-gray-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Geological Ground Stations</h4>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400">12 stations reporting telemetry: ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Satellite Radar Link</h4>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400">SAR Sentinel Uplink sync: ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Civil Siren Mesh</h4>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400">Siren broadcasting grids: ARMED</span>
          </div>
        </div>

      </div>

    </div>
  );
}
