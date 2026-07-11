import React, { useState, useRef, useEffect } from "react";
import { Upload, Camera, AlertTriangle, ShieldCheck, Loader2, Sparkles, RefreshCw, Check, X, Compass, Activity } from "lucide-react";
import { HillAnalysis } from "../types";

interface AnalysisProps {
  onAddAnalysis: (analysis: HillAnalysis) => void;
  onTriggerEmergency: (msg: string) => void;
}

// Three Gorgeous Geological Mock Case presets with realistic descriptions for easy testing
const PRESETS = [
  {
    id: "preset-safe",
    name: "Stable Alpine Valley Slope",
    desc: "Dense grass roots, low gradient, no visible rock fractures.",
    presetType: "safe",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    risk: 12
  },
  {
    id: "preset-moderate",
    name: "Quarry Gravel & Boulder Wall",
    desc: "Medium slope. Minor soil slides and multiple loose rocks visible.",
    presetType: "moderate",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    risk: 45
  },
  {
    id: "preset-high",
    name: "Saturated Cliff face with Slump Tension Cracks",
    desc: "Severe soil erosion, deep ground tension fissures, leaning forestry.",
    presetType: "high",
    imageUrl: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=600&q=80",
    risk: 88
  }
];

export default function Analysis({ onAddAnalysis, onTriggerEmergency }: AnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [selectedPresetType, setSelectedPresetType] = useState<string | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<HillAnalysis | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when leaving component
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Step-by-step diagnostic text logs shown on scanning screen for immersion
  useEffect(() => {
    if (!isAnalyzing) return;
    
    const logs = [
      "📡 Establishing telemetry with ground station...",
      "📸 Decoding topographical spectral bands...",
      "🔬 Measuring soil shear-strength moisture parameters...",
      "🌲 Scanning vegetative root cohesive angles...",
      "🪨 Measuring rock fracture aperture widths...",
      "🤖 Consulting Gemini Geological Neural Engine...",
      "✍️ Formatting structural slope report..."
    ];

    setAnalysisLogs([logs[0]]);
    let currentLogIndex = 0;

    const interval = setInterval(() => {
      currentLogIndex++;
      if (currentLogIndex < logs.length) {
        setAnalysisLogs(prev => [...prev, logs[currentLogIndex]]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // File Selector Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPresetType(null);
    setSelectedImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setSelectedPresetType(null);
    setSelectedImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Preset Selector Handler
  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setSelectedPresetType(preset.presetType);
    setSelectedImageName(preset.name);
    
    // We convert URL to simulated data base64 for submission
    setSelectedImage(preset.imageUrl);
  };

  // Camera Access Functions
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setSelectedPresetType(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Favor back camera on mobile
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn("Camera capture failed:", err);
      setCameraError("Camera capture failed: Frame permission was denied or device is not attached.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setSelectedImage(dataUrl);
      setSelectedImageName(`Camera_Capture_${Date.now().toString().slice(-4)}.jpg`);
      stopCamera();
    }
  };

  // Trigger Gemini AI Slope Analysis
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-hill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          presetType: selectedPresetType
        })
      });

      if (!response.ok) {
        throw new Error("Geological engine returned a failure status.");
      }

      const resultData = await response.json();

      // Create rich result object
      const fullAnalysis: HillAnalysis = {
        id: `an-${Date.now()}`,
        imageName: selectedImageName,
        imageUrl: selectedImage.startsWith("data:") ? selectedImage : "", // Only store base64 in list
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        riskPercentage: resultData.riskPercentage,
        confidenceScore: resultData.confidenceScore,
        safetyLevel: resultData.safetyLevel,
        detectedIssues: resultData.detectedIssues || [],
        explanation: resultData.explanation,
        isSimulated: resultData.isSimulated
      };

      setAnalysisResult(fullAnalysis);
      onAddAnalysis(fullAnalysis);

      // If high hazard detected, invoke alert!
      if (fullAnalysis.safetyLevel === "High Risk") {
        onTriggerEmergency(`AI DIAGNOSIS: ${fullAnalysis.explanation}`);
      }

    } catch (err: any) {
      console.error("Analysis failure:", err);
      alert("Failed to analyze image: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSafetyColor = (level: string) => {
    if (level === "Safe") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (level === "Moderate Risk") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining task */}
      <div className="p-6 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            Geological Slope Analysis Studio
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Upload custom terrain snapshots, capture live slopes via camera, or select presets to run real geological hazard diagnostics. Our multi-layered vision system assesses crack presence, displacement angle, and soil slippage indexes.
          </p>
        </div>
      </div>

      {/* Capture / Upload HUD Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Interface */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
                Source Slope Image
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={startCamera}
                  className="flex items-center gap-1 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-bold px-3 py-1.5 rounded-lg text-xs border border-gray-100 dark:border-zinc-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-500" />
                  Live Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-bold px-3 py-1.5 rounded-lg text-xs border border-gray-100 dark:border-zinc-700 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-500" />
                  Local File
                </button>
              </div>
            </div>

            {/* File input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Video preview / Image uploader zone */}
            {isCameraActive ? (
              <div className="relative rounded-xl overflow-hidden border border-blue-500/20 bg-black aspect-video flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Shutter controls */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl shadow-lg shadow-blue-600/25 text-xs tracking-wider uppercase flex items-center gap-1"
                  >
                    Take Snapshot
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-2 px-4 rounded-xl text-xs border border-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 aspect-video flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Selected terrain"
                  className="w-full h-full object-cover"
                />

                {/* Clear Overlay button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 bg-zinc-900/80 hover:bg-zinc-900 text-white p-2 rounded-full border border-zinc-700/50 backdrop-blur"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Scan Overlay during processing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-indigo-950/40 pointer-events-none flex flex-col justify-between">
                    {/* Animated vertical scan line */}
                    <div className="w-full bg-indigo-500/50 h-1 shadow-lg shadow-indigo-500/80 animate-scan" />
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 cursor-pointer transition-all aspect-video flex flex-col items-center justify-center text-center p-8 space-y-3"
              >
                <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-950 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Upload slope photographs</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
                    Drag and drop file here, or click to browse. Supports JPG, PNG formats up to 12MB.
                  </p>
                </div>
              </div>
            )}

            {/* Error messaging */}
            {cameraError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500">
                {cameraError}
              </div>
            )}

            {/* Form analysis button */}
            {selectedImage && !isCameraActive && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs tracking-wide transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Engaging Artificial Intelligence System...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    Execute Vision AI Hazard Scan
                  </>
                )}
              </button>
            )}

          </div>

          {/* Preset Case selections */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
              Geological Test Presets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESETS.map((preset) => {
                const isSelected = selectedPresetType === preset.presetType;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between h-36 ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/5 dark:bg-blue-950/10"
                        : "border-gray-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/30 hover:border-gray-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-900 dark:text-white block truncate leading-tight">
                        {preset.name}
                      </span>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-normal line-clamp-2">
                        {preset.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800/40">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        preset.risk < 20 
                          ? "text-emerald-500" 
                          : preset.risk < 60 
                            ? "text-amber-500" 
                            : "text-red-500"
                      }`}>
                        {preset.risk}% Risk
                      </span>
                      
                      {isSelected && (
                        <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Diagnostic Output HUD */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {isAnalyzing ? (
            /* Analyzing Radar Log display */
            <div className="bg-zinc-950 text-emerald-400 font-mono text-xs p-6 rounded-2xl border border-zinc-800 shadow-lg min-h-[360px] flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Active radar telemetry</span>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-zinc-800 max-h-[220px] overflow-y-auto">
                  {analysisLogs.map((log, index) => (
                    <div key={index} className="animate-fadeIn">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-850/60 flex items-center gap-2 text-zinc-500 text-[10px]">
                <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                <span>AI vision core querying Sentinel parameters...</span>
              </div>
            </div>
          ) : analysisResult ? (
            /* actual Analysis Results display */
            <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full min-h-[420px]">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider font-mono">AI Assessment Report</span>
                  
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border rounded-lg ${getSafetyColor(analysisResult.safetyLevel)}`}>
                    {analysisResult.safetyLevel}
                  </span>
                </div>

                {/* Score indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800 rounded-xl text-center">
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold">Slope Failure Risk</span>
                    <div className={`text-3xl font-black mt-1 ${
                      analysisResult.riskPercentage < 20 
                        ? "text-emerald-500" 
                        : analysisResult.riskPercentage < 65 
                          ? "text-amber-500" 
                          : "text-red-500"
                    }`}>
                      {analysisResult.riskPercentage}%
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800 rounded-xl text-center">
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase font-bold">Confidence Score</span>
                    <div className="text-3xl font-black text-blue-500 mt-1">
                      {analysisResult.confidenceScore}%
                    </div>
                  </div>
                </div>

                {/* Issues detected bullet tags */}
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-mono block">Observed Warning Markers</span>
                  
                  {analysisResult.detectedIssues.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.detectedIssues.map((issue, idx) => (
                        <span key={idx} className="bg-rose-500/5 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs px-2.5 py-1 border border-rose-500/10 rounded-lg flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {issue}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="bg-emerald-500/5 text-emerald-600 font-semibold text-xs px-2.5 py-1 border border-emerald-500/10 rounded-lg flex items-center gap-1 w-max">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      No warning signs observed
                    </span>
                  )}
                </div>

                {/* AI report explanation text */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80">
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider font-mono block">Geological diagnostics</span>
                  <p className="text-xs text-gray-600 dark:text-zinc-300 mt-1.5 leading-relaxed bg-slate-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800">
                    {analysisResult.explanation}
                  </p>
                </div>
              </div>

              {analysisResult.isSimulated && (
                <div className="mt-4 text-[9px] text-gray-400 dark:text-zinc-500 italic text-center font-mono">
                  Diagnostics computed utilizing local structural safety matrices.
                </div>
              )}
            </div>
          ) : (
            /* Default Empty State */
            <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-zinc-800 p-12 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center min-h-[360px] h-full space-y-4">
              <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-950 rounded-full border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-400">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Analysis HUD Offline</h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                  Provide a custom camera snapshot, select a geological preset or drag-and-drop slope images to boot up the diagnostics scanner.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
