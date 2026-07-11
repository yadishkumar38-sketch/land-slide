import React, { useState, useEffect } from "react";
import { MapPin, ShieldAlert, Compass, Home, RefreshCw, Layers, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { MapMarker } from "../types";

interface RiskMapProps {
  userLocation: { x: number; y: number; name: string };
  onUserLocationChange: (x: number, y: number, name: string) => void;
  activeHighRisk?: boolean;
}

export default function RiskMap({ userLocation, onUserLocationChange, activeHighRisk = false }: RiskMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [nearestShelter, setNearestShelter] = useState<MapMarker | null>(null);

  // Default Map Markers configured inside a mock 100x100 grid space
  const initialMarkers: MapMarker[] = [
    {
      id: "sh-1",
      type: "shelter",
      name: "Summit Community Center Shelter",
      lat: 25,
      lng: 35,
      description: "Concrete fortified community facility stocked with emergency rations, water, blankets, and medical equipment.",
      capacity: "120 / 300 spaces available"
    },
    {
      id: "sh-2",
      type: "shelter",
      name: "Valley Safe Haven High School",
      lat: 78,
      lng: 82,
      description: "Low-lying reinforced stadium gym outside of landslide path. 24/7 medical station and communication link.",
      capacity: "45 / 500 spaces available"
    },
    {
      id: "sh-3",
      type: "shelter",
      name: "North Ridge Ranger Outpost",
      lat: 15,
      lng: 85,
      description: "Emergency shelter run by National Forestry Rangers. Sat-comm equipped.",
      capacity: "12 / 80 spaces available"
    },
    {
      id: "hz-1",
      type: "history",
      name: "2024 Mudslide site - Highway 9",
      lat: 52,
      lng: 48,
      description: "Steep highway pass where a 4,000 cubic meter mudflow severed transit paths following heavy monsoons.",
      riskLevel: "Moderate"
    },
    {
      id: "hz-2",
      type: "history",
      name: "2025 Rockfall Area - East Cliff face",
      lat: 38,
      lng: 68,
      description: "Active tension cracks in bedrock. Frequent loose boulder failures make this highly hazardous during freeze-thaw cycles.",
      riskLevel: "High"
    },
    {
      id: "hz-3",
      type: "history",
      name: "Historic Valley Torrent Site",
      lat: 85,
      lng: 25,
      description: "Alluvial soil fan subject to seasonal saturation-induced debris flow failures.",
      riskLevel: "Moderate"
    }
  ];

  // Areas designated as High Landslide Prone Zones (represented as SVG Polygons/Circles)
  const landslideProneZones = [
    { id: "zone-1", cx: 45, cy: 55, r: 18, name: "East Cliff Unstable Colluvium Face", severity: "High" },
    { id: "zone-2", cx: 62, cy: 35, r: 12, name: "Mount Shasta North Steep Slope", severity: "High" },
    { id: "zone-3", cx: 80, cy: 20, r: 15, name: "South Ridge Clay-Rich Slip Bed", severity: "Moderate" }
  ];

  // Find nearest shelter based on user grid coordinates
  useEffect(() => {
    const shelters = initialMarkers.filter((m) => m.type === "shelter");
    if (shelters.length === 0) return;

    let minDistance = Infinity;
    let closest: MapMarker | null = null;

    shelters.forEach((sh) => {
      const dx = sh.lng - userLocation.x;
      const dy = sh.lat - userLocation.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        minDistance = distance;
        closest = sh;
      }
    });

    setNearestShelter(closest);
  }, [userLocation]);

  // Handle map click to re-position user
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Convert coordinates to rounded decimals
    const roundedX = Math.round(clickX * 10) / 10;
    const roundedY = Math.round(clickY * 10) / 10;

    onUserLocationChange(roundedX, roundedY, `Point: ${roundedX}°E, ${100 - roundedY}°N`);
  };

  // Distance calculation (arbitrary units converted to meters)
  const calculateMeters = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy) * 45); // 1 map unit = 45 meters
  };

  const distToNearest = nearestShelter 
    ? calculateMeters(userLocation, { x: nearestShelter.lng, y: nearestShelter.lat }) 
    : 0;

  // Evacuation time assuming cautious evacuation pace (1.2 meters per second)
  const minutesToNearest = nearestShelter 
    ? Math.round(distToNearest / (1.2 * 60)) 
    : 0;

  const handleMarkerClick = (marker: MapMarker, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering map re-position click
    setSelectedMarker(marker);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500 animate-spin-slow" />
            Live Slope Risk & Evacuation Mapping
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
            Click anywhere on the terrain map to set your current location and calculate a real-time safe egress path.
          </p>
        </div>

        {/* Map Layers Toggles */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showZones
                ? "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-transparent"
            }`}
          >
            {showZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Prone Hazard Zones
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showHistory
                ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-transparent"
            }`}
          >
            {showHistory ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Historic Slides
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showShelters
                ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-transparent"
            }`}
          >
            {showShelters ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Emergency Shelters
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Sidebar Info */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* SVG Interactive Map Canvas */}
        <div className="xl:col-span-2 bg-slate-50 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-inner relative select-none">
          {/* Grid Background Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

          {/* Map Status indicator */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-white/95 dark:bg-zinc-900/95 backdrop-blur border border-gray-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Topographical Radar Live
            </span>
          </div>

          <svg
            viewBox="0 0 100 100"
            className="w-full h-auto aspect-square cursor-crosshair"
            onClick={handleMapClick}
          >
            {/* Topographical Contour Mock Ridges */}
            <path d="M -10,30 Q 15,10 50,35 T 110,15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-zinc-900" />
            <path d="M -10,45 Q 25,20 60,50 T 110,35" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-zinc-900" strokeDasharray="2,2" />
            <path d="M -10,60 Q 35,40 70,65 T 110,50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-zinc-900" />
            <path d="M -10,75 Q 45,55 80,80 T 110,65" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-zinc-900" strokeDasharray="2,2" />

            {/* Render Landslide Prone Hazard Zones (Polygons or circular gradients) */}
            {showZones && landslideProneZones.map((zone) => (
              <g key={zone.id}>
                {/* Outer Glow */}
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.r}
                  fill="url(#hazard-gradient)"
                  className="animate-pulse opacity-45"
                />
                {/* Border line */}
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r={zone.r}
                  fill="none"
                  stroke={zone.severity === "High" ? "#ef4444" : "#f59e0b"}
                  strokeWidth="0.4"
                  strokeDasharray="1.5,1.5"
                />
                {/* Zone tag label */}
                <text
                  x={zone.cx}
                  y={zone.cy + zone.r + 2.5}
                  textAnchor="middle"
                  className="fill-red-600/85 dark:fill-red-400 font-mono text-[1.8px] font-bold uppercase tracking-wider"
                >
                  {zone.name}
                </text>
              </g>
            ))}

            {/* Gradient Definitions */}
            <defs>
              <radialGradient id="hazard-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#ef4444" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Evacuation Safe Route Line */}
            {nearestShelter && showShelters && (
              <g>
                <line
                  x1={userLocation.x}
                  y1={userLocation.y}
                  x2={nearestShelter.lng}
                  y2={nearestShelter.lat}
                  stroke="#10b981"
                  strokeWidth="0.8"
                  strokeDasharray="1.5,1.5"
                  className="animate-[dash_20s_linear_infinite]"
                  style={{
                    strokeDashoffset: 100,
                  }}
                />
                {/* Pulse at route midpoint */}
                <circle
                  cx={(userLocation.x + nearestShelter.lng) / 2}
                  cy={(userLocation.y + nearestShelter.lat) / 2}
                  r="1"
                  fill="#10b981"
                  className="animate-ping"
                />
              </g>
            )}

            {/* Map Markers (Shelters and History points) */}
            {initialMarkers.map((marker) => {
              if (marker.type === "shelter" && !showShelters) return null;
              if (marker.type === "history" && !showHistory) return null;

              const isShelter = marker.type === "shelter";
              const color = isShelter ? "text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40" : "text-amber-500 fill-amber-100 dark:fill-amber-950/40";
              const strokeColor = isShelter ? "#10b981" : "#f59e0b";

              return (
                <g 
                  key={marker.id}
                  transform={`translate(${marker.lng}, ${marker.lat})`}
                  className="cursor-pointer group transition-transform hover:scale-125"
                  onClick={(e) => handleMarkerClick(marker, e)}
                >
                  {/* Pin outer pulse */}
                  <circle
                    cx="0"
                    cy="0"
                    r="2.5"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="0.25"
                    className="animate-ping opacity-40"
                  />
                  {/* Pin Icon Shape */}
                  {isShelter ? (
                    <path
                      d="M -1.5,-1.5 L 1.5,-1.5 L 1.5,1.5 L -1.5,1.5 Z"
                      fill={color.includes("fill-") ? undefined : color}
                      stroke={strokeColor}
                      strokeWidth="0.45"
                      className={`${color}`}
                    />
                  ) : (
                    <polygon
                      points="0,-2 1.8,1.2 -1.8,1.2"
                      stroke={strokeColor}
                      strokeWidth="0.4"
                      className={`${color}`}
                    />
                  )}
                  {/* Mini Marker initial */}
                  <text
                    x="0"
                    y="0.6"
                    textAnchor="middle"
                    className="fill-gray-900 dark:fill-white text-[1.4px] font-extrabold"
                  >
                    {isShelter ? "H" : "!"}
                  </text>
                </g>
              );
            })}

            {/* User Position Pin */}
            <g
              transform={`translate(${userLocation.x}, ${userLocation.y})`}
              className="pointer-events-none"
            >
              {/* Outer wave */}
              <circle
                cx="0"
                cy="0"
                r="4.5"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.4"
                className="animate-ping opacity-70"
              />
              <circle
                cx="0"
                cy="0"
                r="2"
                fill="#3b82f6"
                className="opacity-25"
              />
              {/* Core Pin point */}
              <circle
                cx="0"
                cy="0"
                r="1.2"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="0.35"
              />
              {/* Pin Header Tag */}
              <g transform="translate(0, -3.2)">
                <rect x="-4.5" y="-1.6" width="9" height="2.2" rx="0.5" fill="#2563eb" />
                <text x="0" y="-0.1" textAnchor="middle" className="fill-white text-[1px] font-bold tracking-wider uppercase">
                  You Are Here
                </text>
              </g>
            </g>
          </svg>

          {/* Quick Compass Indicator */}
          <div className="absolute bottom-4 right-4 bg-zinc-900/80 backdrop-blur text-white px-2.5 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1.5 text-xs font-mono font-bold shadow-md">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            GPS ACCURACY: ±4M
          </div>
        </div>

        {/* Evacuation Information Sidebar */}
        <div className="space-y-6">
          {/* Evacuation HUD Card */}
          <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/5 border border-emerald-500/20 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Dynamic Egress Route Planning
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Calculated safe egress vectors based on your live spatial marker relative to nearby geological hazard boundaries.
            </p>

            <div className="mt-5 space-y-4">
              {/* Position Readout */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Your Position</span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                  {userLocation.x}X , {userLocation.y}Y
                </span>
              </div>

              {/* Nearest Shelter */}
              <div className="space-y-1 pb-3 border-b border-gray-100 dark:border-zinc-800">
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium block">Nearest Designated Refuge</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white block truncate">
                  {nearestShelter ? nearestShelter.name : "None identified"}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                  {nearestShelter ? nearestShelter.capacity : ""}
                </span>
              </div>

              {/* Escape Vectors */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Distance</span>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {distToNearest} m
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Egress Time</span>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {minutesToNearest} mins
                  </div>
                </div>
              </div>
            </div>

            {/* Evacuation Alert Bar if slope hazard active */}
            {activeHighRisk && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg flex items-center gap-2 animate-pulse">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Immediate hazard zone active! Move now.
              </div>
            )}
          </div>

          {/* Interactive Inspector Sidebar Drawer */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            {selectedMarker ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    selectedMarker.type === "shelter" 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10"
                  }`}>
                    {selectedMarker.type === "shelter" ? "Emergency Shelter" : "Historic Slump Event"}
                  </span>
                  
                  <button 
                    onClick={() => setSelectedMarker(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold"
                  >
                    Clear
                  </button>
                </div>

                <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  {selectedMarker.name}
                </h4>

                <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed bg-gray-50 dark:bg-zinc-950/40 p-3 rounded-lg border border-gray-100 dark:border-zinc-800">
                  {selectedMarker.description}
                </p>

                {selectedMarker.capacity && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    🏢 Operational Occupancy: <span className="font-bold">{selectedMarker.capacity}</span>
                  </div>
                )}

                {selectedMarker.riskLevel && (
                  <div className={`p-3 rounded-lg text-xs font-medium border ${
                    selectedMarker.riskLevel === "High" 
                      ? "bg-red-500/5 text-red-700 dark:text-red-400 border-red-500/10" 
                      : "bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-500/10"
                  }`}>
                    ⚠️ Landslide Failure Class: <span className="font-bold">{selectedMarker.riskLevel} Severity</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    onUserLocationChange(selectedMarker.lng, selectedMarker.lat, `Marker: ${selectedMarker.name}`);
                  }}
                  className="w-full bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-zinc-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Teleport User Location Here
                </button>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-950 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center mx-auto text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Inspector Unoccupied</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Click on any landmark pin (squares represent refuge centers, triangles represent past failures) to inspect.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
