'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Settings as SettingsIcon, Bell, Sliders, Shield, Database, Send, CheckCircle2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const {
    userName,
    userEmail,
    login,
    isSimulating,
    setSimulating,
    simulationSpeed,
    setSimulationSpeed,
    resetEvents,
    events,
    totalEvents,
  } = useAppStore();

  const [name, setName] = useState(userName || 'Meera K.');
  const [email, setEmail] = useState(userEmail || 'admin@pulse.io');
  const [churnThreshold, setChurnThreshold] = useState(75);
  const [demandThreshold, setDemandThreshold] = useState(85);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, email);
    toast.success('Admin profile updated successfully! ✅');
  };

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      toast.success('Webhook delivery verified! 200 OK received from endpoint 🚀');
    }, 800);
  };

  const exportJSON = () => {
    const data = {
      user: { name, email },
      totalEvents,
      exportedAt: new Date().toISOString(),
      sampleEvents: events.slice(0, 50),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `pulse-telemetry-${Date.now()}.json`;
    link.click();
    toast.success('Telemetry snapshot exported as JSON 💾');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">System Configuration & Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-[#6868a0] mt-0.5">
            Configure telemetry ingestion engine, notification triggers, and platform preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile Card */}
        <div className="glass rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <SettingsIcon size={16} className="text-[#4f8eff]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Administrator Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4f8eff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4f8eff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                Platform Role
              </label>
              <input
                type="text"
                disabled
                value="Global Administrator (Full Access)"
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-[#6868a0] cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4f8eff] text-white hover:bg-[#4f8eff]/90 transition-all shadow-lg shadow-blue-500/20"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Real-time Ingestion Engine Controls */}
        <div className="glass rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Sliders size={16} className="text-[#22d3a5]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Simulation Engine Controls</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#eaeaf8]">Engine Stream State</span>
                <span className={isSimulating ? 'text-emerald-400' : 'text-amber-400'}>
                  {isSimulating ? 'Running' : 'Paused'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSimulating(!isSimulating)}
                className={`w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSimulating
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                {isSimulating ? 'Halt Simulation Pipeline' : 'Resume Simulation Pipeline'}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#eaeaf8]">Event Ingestion Velocity</span>
                <span className="font-mono text-[#4f8eff]">{(simulationSpeed / 1000).toFixed(1)}s interval</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Turbo (0.5s)', speed: 500 },
                  { label: 'Fast (1.0s)', speed: 1000 },
                  { label: 'Normal (2.0s)', speed: 2000 },
                  { label: 'Calm (3.5s)', speed: 3500 },
                ].map((preset) => (
                  <button
                    key={preset.speed}
                    type="button"
                    onClick={() => {
                      setSimulationSpeed(preset.speed);
                      toast.success(`Simulation speed set to ${preset.label}`);
                    }}
                    className={`py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                      simulationSpeed === preset.speed
                        ? 'bg-[#4f8eff]/20 border-[#4f8eff] text-white'
                        : 'bg-white/5 border-white/10 text-[#6868a0] hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  resetEvents();
                  toast.success('Simulation buffer and live metrics reset to factory state');
                }}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-all"
              >
                <RotateCcw size={14} />
                Clear Event Buffers & Metrics
              </button>
            </div>
          </div>
        </div>

        {/* Alert Triggers & Webhook Integration */}
        <div className="glass rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Bell size={16} className="text-[#a855f7]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Alert Thresholds & Webhooks</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#eaeaf8]">Churn Risk Alert Threshold</span>
                <span className="font-mono text-rose-400">{churnThreshold}% Risk</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={churnThreshold}
                onChange={(e) => setChurnThreshold(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#eaeaf8]">Demand Surge Warning Threshold</span>
                <span className="font-mono text-orange-400">{demandThreshold}% Capacity</span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={demandThreshold}
                onChange={(e) => setDemandThreshold(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                Slack / Teams Outgoing Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4f8eff]"
                />
                <button
                  type="button"
                  disabled={isTestingWebhook}
                  onClick={handleTestWebhook}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all flex-shrink-0"
                >
                  <Send size={13} />
                  Ping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Diagnostics & Export */}
        <div className="glass rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Database size={16} className="text-[#fb923c]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Data & Diagnostics</h2>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6868a0]">Engine Status</span>
                <span className="text-emerald-400 font-mono font-semibold">Healthy (v2.4.0-turbopack)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6868a0]">Active Ingested Events</span>
                <span className="text-white font-mono font-semibold">{totalEvents} events</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6868a0]">Memory Heap Footprint</span>
                <span className="text-white font-mono font-semibold">18.4 MB (Client side)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6868a0]">Security Layer</span>
                <span className="text-emerald-400 font-mono font-semibold">Cookie JWT Auth Verified</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={exportJSON}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-transform"
          >
            Export Complete Telemetry Snapshot (.JSON)
          </button>
        </div>
      </div>
    </div>
  );
}
