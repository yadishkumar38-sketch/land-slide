import React, { useState } from "react";
import { Search, Filter, Calendar, Users, AlertTriangle, ChevronRight, ChevronDown, CheckCircle, FlameKindling, Landmark } from "lucide-react";
import { LandslideEvent } from "../types";

export default function Database() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Archive historical database records
  const historicalEvents: LandslideEvent[] = [
    {
      id: "ev-1",
      location: "Highway 9, East Cliff Corridor",
      date: "May 12, 2025",
      cause: "High saturation from heavy monsoon rainfall (120mm in 12 hours)",
      severity: "Severe",
      affectedPeople: 450,
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
      lat: 52,
      lng: 48
    },
    {
      id: "ev-2",
      location: "Summit Foothills Housing Society",
      date: "December 04, 2024",
      cause: "Improper road excavation cutting into slope toe, destabilizing friction angle",
      severity: "Extreme",
      affectedPeople: 1850,
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      lat: 38,
      lng: 68
    },
    {
      id: "ev-3",
      location: "North Ridge Forestry Trails",
      date: "August 18, 2024",
      cause: "Soil shear failure induced by 4.2 magnitude earthquake tremor",
      severity: "Moderate",
      affectedPeople: 80,
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      lat: 15,
      lng: 85
    },
    {
      id: "ev-4",
      location: "South Valley Alluvial Farmland",
      date: "January 29, 2024",
      cause: "Seasonal saturation and stream bank scouring eroding bottom slope support",
      severity: "Minor",
      affectedPeople: 15,
      imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=600&q=80",
      lat: 85,
      lng: 25
    },
    {
      id: "ev-5",
      location: "West Cliff Village Terrace",
      date: "November 14, 2023",
      cause: "Heavy rain coupled with deforested slope surfaces removing root cohesion",
      severity: "Extreme",
      affectedPeople: 3200,
      imageUrl: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=600&q=80",
      lat: 72,
      lng: 15
    }
  ];

  // Filtering Logic
  const filteredEvents = historicalEvents.filter((event) => {
    const matchesSearch = 
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.cause.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = 
      severityFilter === "all" || event.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Extreme":
        return "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40";
      case "Severe":
        return "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40";
      case "Moderate":
        return "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent";
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by location, hazard trigger, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950/40 text-gray-900 dark:text-white pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Severity filter dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Filter className="w-3.5 h-3.5" />
            Class Severity
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-zinc-950/40 text-gray-900 dark:text-white text-sm font-semibold border border-gray-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Levels</option>
            <option value="Extreme">Extreme</option>
            <option value="Severe">Severe</option>
            <option value="Moderate">Moderate</option>
            <option value="Minor">Minor</option>
          </select>
        </div>

      </div>

      {/* Historical List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const isExpanded = expandedId === event.id;

            return (
              <div 
                key={event.id}
                className="bg-white dark:bg-zinc-900/60 backdrop-blur rounded-2xl border border-gray-100 dark:border-zinc-800/80 shadow-sm overflow-hidden transition-all hover:border-gray-200 dark:hover:border-zinc-700"
              >
                {/* Summary Row */}
                <div 
                  onClick={() => toggleExpand(event.id)}
                  className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-all select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 text-gray-500 dark:text-zinc-400 border border-gray-200/50 dark:border-zinc-700/50">
                      <Landmark className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                        {event.location}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          {event.affectedPeople.toLocaleString()} affected residents
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <span className={`px-2.5 py-1 text-xs font-bold border rounded-lg ${getSeverityBadge(event.severity)}`}>
                      {event.severity} Trigger
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 transition-transform" />
                      ) : (
                        <ChevronRight className="w-5 h-5 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-50 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/25 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                    
                    {/* Visual representation */}
                    <div className="md:col-span-1 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 bg-zinc-900 aspect-video md:aspect-auto flex items-center justify-center relative min-h-[160px]">
                      {/* Using high-quality placeholder mountain failure graphics */}
                      <div className="absolute inset-0 bg-zinc-950 flex flex-col justify-end p-4">
                        <span className="text-[10px] font-mono font-bold text-red-500 tracking-wider block uppercase">Geological failure profile</span>
                        <span className="text-xs text-zinc-400 mt-1">Cross-section slope sliding plane diagram</span>
                      </div>
                      
                      {/* Vector failure wireframe */}
                      <svg viewBox="0 0 100 60" className="w-4/5 h-auto opacity-45">
                        <path d="M 5,55 L 45,35 L 75,15 L 95,15" fill="none" stroke="#f43f5e" strokeWidth="1" />
                        <path d="M 5,55 Q 38,48 55,25 Q 75,15 95,15" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="2,2" className="animate-pulse" />
                        <text x="50" y="48" className="fill-zinc-500 text-[5px]" textAnchor="middle">Failure slip vector</text>
                      </svg>
                    </div>

                    {/* Report Text */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-mono block">Triggering Diagnostics</span>
                        <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-semibold">
                          {event.cause}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white dark:bg-zinc-900/60 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                          <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-bold block">Incident Coordinates</span>
                          <span className="text-xs font-mono font-bold text-gray-900 dark:text-white mt-1 block">
                            Lat: {event.lat}°N, Lng: {event.lng}°E
                          </span>
                        </div>
                        <div className="p-3 bg-white dark:bg-zinc-900/60 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                          <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-bold block">Mitigation Status</span>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Fortified & Closed
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2 leading-relaxed">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5">Post-Failure Analysis Advice:</span>
                          This location features heavy presence of highly weathered colluvial soil overlying impervious bedrock. Ground tension monitoring sensors have been permanently anchored.
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-zinc-900/60 p-12 rounded-2xl border border-gray-100 dark:border-zinc-800 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-950 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center mx-auto text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">No Historical Entries Match</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                No past landslide reports fit your current search string or selected severity tier. Refine your query parameters.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
