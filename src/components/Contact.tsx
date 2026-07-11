import React, { useState } from "react";
import { Phone, Mail, Globe, Send, CheckCircle, ShieldAlert, Heart, Star } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Emergency Helplines sidebar cards */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 dark:from-red-950/20 dark:to-orange-950/5 border border-red-500/25 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/15 text-red-500 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Emergency Helplines</h3>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-mono">24/7 Civil Emergency Services</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Helpline Item */}
            <div className="p-3 bg-white dark:bg-zinc-950/35 border border-red-500/10 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-gray-400 dark:text-zinc-500 font-bold block uppercase tracking-wider">Search & Rescue Squad</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white block">+1 (800) 911-SLIDE</span>
              </div>
              <a href="tel:18009117543" className="w-8 h-8 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Helpline Item */}
            <div className="p-3 bg-white dark:bg-zinc-950/35 border border-red-500/10 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-gray-400 dark:text-zinc-500 font-bold block uppercase tracking-wider">Red Cross Disaster Relief</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white block">+1 (800) 555-HELP</span>
              </div>
              <a href="tel:18005554357" className="w-8 h-8 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Helpline Item */}
            <div className="p-3 bg-white dark:bg-zinc-950/35 border border-red-500/10 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs text-gray-400 dark:text-zinc-500 font-bold block uppercase tracking-wider">Geological Assessment Div</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white block">+1 (800) 244-SENS</span>
              </div>
              <a href="tel:18002447367" className="w-8 h-8 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Agency contact details */}
        <div className="bg-white dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">
            Command Center Contacts
          </h3>

          <div className="space-y-3.5 text-xs text-gray-600 dark:text-zinc-300">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>support@ai-landslide-alert.gov</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>+1 (213) 555-0144 (Direct Line)</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>www.ai-landslide-warning-system.gov</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase font-mono">Follow updates</span>
            <div className="flex gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 flex items-center justify-center text-xs font-bold font-mono cursor-pointer transition-colors text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700">TW</span>
              <span className="w-6 h-6 rounded-md bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 flex items-center justify-center text-xs font-bold font-mono cursor-pointer transition-colors text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700">FB</span>
              <span className="w-6 h-6 rounded-md bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 flex items-center justify-center text-xs font-bold font-mono cursor-pointer transition-colors text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700">LI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message and Feedback Form */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-gray-100 dark:border-zinc-800 p-8 rounded-2xl shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Command Center Feedback & Report Filing</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 leading-relaxed">
            Report minor ground shifts or provide feedback directly to the technical team administering the landslide early warning mesh network.
          </p>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-scaleUp">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/15">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Report Dispatched Successfully</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Your feedback and system diagnostics report have been safely transmitted to geological response administrators. Thank you for keeping your community secure.
                </p>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-zinc-900 dark:bg-zinc-800 text-white font-semibold py-2 px-6 rounded-xl text-xs hover:bg-zinc-800 border border-zinc-700"
              >
                File Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-zinc-950/40 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 dark:bg-zinc-950/40 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Report/Message Content</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail any observed environmental conditions (e.g., minor rock slumps, new soil cracks) or general system feedback..."
                  className="w-full bg-slate-50 dark:bg-zinc-950/40 text-gray-900 dark:text-white px-4 py-3 rounded-xl border border-gray-100 dark:border-zinc-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-xl text-xs tracking-wide transition-all shadow hover:shadow-md flex items-center justify-center gap-2 border border-zinc-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transmitting Diagnostics...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Report File
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
          <span>Made for geological hazard monitoring, community safety, and active lives protection.</span>
        </div>
      </div>

    </div>
  );
}
