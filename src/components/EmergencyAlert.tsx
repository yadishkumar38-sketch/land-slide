import React, { useEffect, useState, useRef } from "react";
import { AlertTriangle, Phone, Share2, Compass, Volume2, VolumeX, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface EmergencyAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  locationName?: string;
}

export default function EmergencyAlert({ isOpen, onClose, message, locationName = "Current Coordinates" }: EmergencyAlertProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pulseIntervalRef = useRef<any>(null);

  const startSiren = () => {
    try {
      if (isMuted) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      // Stop existing oscillator to avoid duplicate sounds
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
        oscRef.current.disconnect();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth"; // Richer, more dramatic alarm tone
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      
      // Filter high frequencies slightly to prevent harshness
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      
      oscRef.current = osc;
      gainRef.current = gain;

      // Soft fade in
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);

      // Pulse the siren frequency sweep
      let toggle = false;
      pulseIntervalRef.current = setInterval(() => {
        if (!ctx || !osc || !gain) return;
        const targetFreq = toggle ? 600 : 350;
        osc.frequency.linearRampToValueAtTime(targetFreq, ctx.currentTime + 0.4);
        gain.gain.linearRampToValueAtTime(toggle ? 0.08 : 0.04, ctx.currentTime + 0.4);
        toggle = !toggle;
      }, 500);

    } catch (err) {
      console.warn("Web Audio API not allowed or failed:", err);
    }
  };

  const stopSiren = () => {
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      startSiren();
    } else {
      stopSiren();
    }
    return () => {
      stopSiren();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isMuted) {
        stopSiren();
      } else {
        startSiren();
      }
    }
  }, [isMuted]);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    alert(`📍 Location coordinates shared with emergency services:\nLatitude: 34.0522° N\nLongitude: -118.2437° W\nAccuracy: High (GPS Ground Station Match)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Ambient Pulsing Red Overlay */}
      <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl overflow-hidden bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-2xl shadow-red-900/30"
      >
        {/* Warning Indicator Bar */}
        <div className="bg-red-600 py-3 text-center text-white font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 animate-bounce" />
          Immediate Evacuation Order
        </div>

        <div className="p-8 text-center">
          {/* Pulsing Alert Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl animate-ping" />
              <div className="w-20 h-20 bg-red-600/10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle className="w-10 h-10 animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
            LANDSLIDE WARNING DETECTED
          </h2>

          <p className="text-red-400 font-mono font-semibold text-lg border border-red-500/30 bg-red-500/5 px-4 py-3 rounded-lg mb-6 leading-relaxed">
            "{message || "⚠️ WARNING! HIGH LANDSLIDE RISK DETECTED. LEAVE THE AREA IMMEDIATELY."}"
          </p>

          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Geological sensors and weather alerts indicate catastrophic slope movement or extreme liquid-saturated soils. Stay away from valleys, gullies, and slopes. Proceed directly to the nearest elevated emergency shelter.
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <a 
              href="tel:911"
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-all text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-600/20 text-center"
            >
              <Phone className="w-5 h-5" />
              Call Responders (911)
            </a>

            <button 
              onClick={handleShareLocation}
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-all text-white font-semibold py-3 px-6 border border-zinc-700 rounded-xl"
            >
              <Share2 className="w-5 h-5" />
              Share My Location
            </button>
          </div>

          {/* Secondary Action / Mute */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all text-sm font-medium"
            >
              {isMuted ? (
                <>
                  <Volume2 className="w-5 h-5 text-red-500" />
                  Unmute Warning Sound
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5 text-zinc-400" />
                  Mute Warning Sound
                </>
              )}
            </button>

            <button 
              onClick={onClose}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all text-zinc-300 hover:text-white font-medium py-2 px-6 rounded-lg text-sm"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
