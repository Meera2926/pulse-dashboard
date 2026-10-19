'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Zap, Download, Search, PlusCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CHANNELS, EVENT_TYPES, CHANNEL_HEX, TYPE_HEX, TYPE_ICONS, Channel, EventType } from '@/lib/constants';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function EventsPage() {
  const {
    events,
    totalEvents,
    isSimulating,
    setSimulating,
    triggerSurge,
    addCustomEvent,
    resetEvents,
  } = useAppStore();

  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showInjectModal, setShowInjectModal] = useState(false);

  // Quick Inject Form State
  const [customChannel, setCustomChannel] = useState<Channel>('Social');
  const [customType, setCustomType] = useState<EventType>('Purchase');
  const [customDetail, setCustomDetail] = useState('');
  const [customAmount, setCustomAmount] = useState('149');

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchChannel = selectedChannel === 'ALL' || e.channel === selectedChannel;
      const matchType = selectedType === 'ALL' || e.type === selectedType;
      const matchSearch =
        search === '' ||
        e.detail.toLowerCase().includes(search.toLowerCase()) ||
        e.channel.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase());
      return matchChannel && matchType && matchSearch;
    });
  }, [events, selectedChannel, selectedType, search]);

  const handleSurge = () => {
    triggerSurge(12);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f8eff', '#a855f7', '#22d3a5', '#fb923c'],
    });
    toast.success('Triggered 12-event real-time surge! ⚡');
  };

  const handleInject = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customAmount) || 0;
    const detail = customDetail.trim() || `Manual ${customType} via ${customChannel}`;
    addCustomEvent({
      channel: customChannel,
      type: customType,
      detail,
      amount,
    });
    toast.success(`Custom event emitted to ${customChannel}! ✨`);
    setCustomDetail('');
    setShowInjectModal(false);
  };

  const exportCSV = () => {
    if (filteredEvents.length === 0) {
      toast.error('No events to export');
      return;
    }
    const headers = ['ID', 'Channel', 'Event Type', 'Detail', 'Amount ($)', 'Timestamp'];
    const rows = filteredEvents.map((e) => [
      e.id,
      e.channel,
      e.type,
      `"${e.detail.replace(/"/g, '""')}"`,
      e.amount,
      e.time,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pulse-events-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredEvents.length} events to CSV 📊`);
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Real-Time Event Stream</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isSimulating
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isSimulating ? 'Live Engine Active' : 'Simulation Paused'}
            </span>
          </div>
          <p className="text-xs text-[#6868a0] mt-0.5">
            Streaming customer telemetry across all tracked touchpoints ({totalEvents} total ingested)
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isSimulating
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isSimulating ? <Pause size={14} /> : <Play size={14} />}
            {isSimulating ? 'Pause Stream' : 'Resume Stream'}
          </button>

          <button
            onClick={handleSurge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform"
          >
            <Zap size={14} />
            Simulate Surge
          </button>

          <button
            onClick={() => setShowInjectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-[#eaeaf8] transition-colors"
          >
            <PlusCircle size={14} />
            Inject Event
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-[#eaeaf8] transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            onClick={() => {
              resetEvents();
              toast.success('Simulation buffer reset');
            }}
            title="Reset Buffer"
            className="p-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-[#6868a0] hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6868a0]" />
            <input
              type="text"
              placeholder="Search by customer name, product, detail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#6868a0] focus:outline-none focus:border-[#4f8eff]/60 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="text-xs text-[#6868a0]">
            Showing <span className="font-bold text-white">{filteredEvents.length}</span> of {events.length} buffered events
          </div>
        </div>

        {/* Channel Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-[#6868a0] uppercase tracking-wider mr-1">Channels:</span>
          {['ALL', ...CHANNELS].map((ch) => {
            const active = selectedChannel === ch;
            const color = ch === 'ALL' ? '#4f8eff' : CHANNEL_HEX[ch as Channel];
            return (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'text-white border'
                    : 'bg-white/5 text-[#6868a0] hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                style={active ? { background: `${color}25`, borderColor: `${color}60`, color } : {}}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {/* Event Type Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-[#6868a0] uppercase tracking-wider mr-1">Types:</span>
          {['ALL', ...EVENT_TYPES].map((tp) => {
            const active = selectedType === tp;
            const color = tp === 'ALL' ? '#a855f7' : TYPE_HEX[tp as EventType];
            return (
              <button
                key={tp}
                onClick={() => setSelectedType(tp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'text-white border'
                    : 'bg-white/5 text-[#6868a0] hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                style={active ? { background: `${color}25`, borderColor: `${color}60`, color } : {}}
              >
                {tp !== 'ALL' && <span className="mr-1">{TYPE_ICONS[tp as EventType]}</span>}
                {tp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Table / Stream */}
      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#6868a0] border-b border-white/10 bg-white/[0.02]">
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Channel</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-4">Event Payload / Details</div>
          <div className="col-span-2 text-right">Value / Metric</div>
        </div>

        <div className="divide-y divide-white/5 max-h-[580px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-[#6868a0]">
              <p className="text-base font-semibold">No events matching criteria</p>
              <p className="text-xs mt-1">Adjust your filters or resume the stream to observe incoming events</p>
            </div>
          ) : (
            filteredEvents.map((e) => {
              const chColor = CHANNEL_HEX[e.channel];
              const tpColor = TYPE_HEX[e.type];
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-12 px-5 py-3.5 items-center text-xs hover:bg-white/[0.04] transition-colors"
                >
                  <div className="col-span-2 font-mono text-[11px] text-[#6868a0]">
                    {e.time}
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chColor }} />
                    <span className="font-medium" style={{ color: chColor }}>{e.channel}</span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: `${tpColor}20`, color: tpColor, border: `1px solid ${tpColor}40` }}
                    >
                      <span>{TYPE_ICONS[e.type]}</span>
                      {e.type}
                    </span>
                  </div>
                  <div className="col-span-4 text-[#eaeaf8] truncate font-medium pr-2">
                    {e.detail}
                  </div>
                  <div className="col-span-2 text-right font-mono font-semibold">
                    {e.amount > 0 ? (
                      <span className="text-emerald-400">+${e.amount}</span>
                    ) : (
                      <span className="text-[#6868a0]">—</span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Inject Modal */}
      <AnimatePresence>
        {showInjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl relative"
            >
              <h2 className="text-lg font-bold mb-1">Inject Custom Event</h2>
              <p className="text-xs text-[#6868a0] mb-4">
                Simulate a real-time event directly into the live ingestion pipeline
              </p>

              <form onSubmit={handleInject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                    Touchpoint Channel
                  </label>
                  <select
                    value={customChannel}
                    onChange={(e) => setCustomChannel(e.target.value as Channel)}
                    className="w-full bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4f8eff]"
                  >
                    {CHANNELS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                    Event Type
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as EventType)}
                    className="w-full bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4f8eff]"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                    Event Detail / Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan upgraded to Enterprise Tier"
                    value={customDetail}
                    onChange={(e) => setCustomDetail(e.target.value)}
                    className="w-full bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#6868a0] focus:outline-none focus:border-[#4f8eff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6868a0] mb-1 uppercase tracking-wider">
                    Monetary Value ($)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-[#0d0d26] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4f8eff]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInjectModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#6868a0] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4f8eff] text-white hover:bg-[#4f8eff]/90 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Publish to Stream
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
