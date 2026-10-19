'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DAYS, CHANNELS, Channel, CHANNEL_HEX } from '@/lib/constants';
import { Flame, Clock, Sparkles, Filter, Info } from 'lucide-react';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function HeatmapPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [hoveredCell, setHoveredCell] = useState<{
    day: string;
    hour: number;
    intensity: number;
    events: number;
    convRate: number;
  } | null>(null);

  // Generate deterministic but realistic day/hour intensity distribution
  const matrix = useMemo(() => {
    return DAYS.map((day, dIdx) => {
      return HOURS.map((hour) => {
        // Business hours peak (9am to 6pm), weekday vs weekend variance
        const isWeekend = day === 'Sat' || day === 'Sun';
        const isPeakHour = hour >= 10 && hour <= 17;
        const isEvening = hour >= 18 && hour <= 21;

        let base = isPeakHour ? 65 : isEvening ? 45 : 20;
        if (isWeekend) base *= 0.65;
        if (day === 'Thu' && (hour === 14 || hour === 15 || hour === 16)) base += 28; // Golden window

        // Add channel variance factor
        const channelFactor = selectedChannel === 'ALL' ? 1.0 : selectedChannel === 'Email' ? 1.2 : 0.9;
        const noise = ((dIdx * 7 + hour * 13) % 20) - 10;
        const intensity = Math.min(100, Math.max(10, Math.round((base + noise) * channelFactor)));
        const events = Math.round(intensity * 12.4);
        const convRate = parseFloat(((intensity / 100) * 4.8 + 1.2).toFixed(1));

        return {
          day,
          hour,
          intensity,
          events,
          convRate,
        };
      });
    });
  }, [selectedChannel]);

  const getHeatColor = (val: number) => {
    if (val > 80) return 'bg-amber-400 text-black';
    if (val > 65) return 'bg-[#4f8eff] text-white';
    if (val > 50) return 'bg-[#a855f7] text-white';
    if (val > 35) return 'bg-[#06b6d4]/60 text-white';
    if (val > 20) return 'bg-white/10 text-[#eaeaf8]';
    return 'bg-white/[0.03] text-[#6868a0]';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Omnichannel Event & Demand Heatmap</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1">
              <Flame size={12} /> Live Surge Matrix
            </span>
          </div>
          <p className="text-xs text-[#6868a0] mt-0.5">
            24-hour weekly event intensity distribution across all tracked channels
          </p>
        </div>

        {/* AI Golden Window Insight */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-xs">
          <Sparkles size={16} className="text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-amber-300">AI Golden Launch Window:</span>{' '}
            <span className="text-[#eaeaf8]">Thursdays 14:00 - 17:00 UTC</span>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#6868a0] uppercase tracking-wider mr-1">Filter Matrix:</span>
          {['ALL', ...CHANNELS].map((ch) => {
            const active = selectedChannel === ch;
            const color = ch === 'ALL' ? '#4f8eff' : CHANNEL_HEX[ch as Channel];
            return (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  active ? 'text-white border' : 'bg-white/5 text-[#6868a0] hover:text-white border border-transparent'
                }`}
                style={active ? { background: `${color}25`, borderColor: `${color}60`, color } : {}}
              >
                {ch}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6868a0]">
          <span>Low</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-white/[0.04]" />
            <span className="w-3 h-3 rounded-sm bg-white/10" />
            <span className="w-3 h-3 rounded-sm bg-[#06b6d4]/60" />
            <span className="w-3 h-3 rounded-sm bg-[#a855f7]" />
            <span className="w-3 h-3 rounded-sm bg-[#4f8eff]" />
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
          </div>
          <span>Surge</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="glass rounded-2xl p-5 overflow-x-auto border border-white/10">
        <div className="min-w-[760px]">
          {/* Hour Labels */}
          <div className="heatmap-grid gap-1 mb-2 text-center text-[10px] font-mono text-[#6868a0]">
            <div className="text-left font-bold uppercase text-[9px]">Day / Hr</div>
            {HOURS.map((h) => (
              <div key={h}>{h % 3 === 0 ? `${h}h` : ''}</div>
            ))}
          </div>

          {/* Day Rows */}
          <div className="space-y-1.5">
            {matrix.map((row, dIdx) => (
              <div key={DAYS[dIdx]} className="heatmap-grid gap-1 items-center">
                <div className="text-xs font-bold text-white font-mono">{DAYS[dIdx]}</div>
                {row.map((cell) => (
                  <motion.button
                    key={`${cell.day}-${cell.hour}`}
                    whileHover={{ scale: 1.25 }}
                    onMouseEnter={() => setHoveredCell(cell)}
                    className={`h-7 rounded-md transition-colors flex items-center justify-center text-[9px] font-mono font-bold cursor-pointer ${getHeatColor(
                      cell.intensity
                    )}`}
                  >
                    {cell.intensity > 80 ? '⚡' : ''}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Inspection Drawer */}
      <div className="glass rounded-2xl p-5 border border-white/10">
        {hoveredCell ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#4f8eff]" />
                <h3 className="text-sm font-bold text-white">
                  {hoveredCell.day} at {hoveredCell.hour.toString().padStart(2, '0')}:00 UTC
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    hoveredCell.intensity > 70
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-blue-400/20 text-blue-300'
                  }`}
                >
                  {hoveredCell.intensity}% Activity Intensity
                </span>
              </div>
              <p className="text-xs text-[#6868a0] mt-1">
                Estimated Ingestion: <span className="text-white font-bold">{hoveredCell.events.toLocaleString()} events</span> | Expected Conversion Rate: <span className="text-emerald-400 font-bold">{hoveredCell.convRate}%</span>
              </p>
            </div>

            <div className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[#eaeaf8]">
              Recommendation:{' '}
              <span className="font-semibold text-[#4f8eff]">
                {hoveredCell.intensity > 70
                  ? 'Optimal for high-ticket email or push campaigns'
                  : 'Maintain automated baseline touchpoints'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#6868a0]">
            <Info size={15} />
            <span>Hover over any hour cell in the matrix above to view detailed volume and conversion analytics</span>
          </div>
        )}
      </div>
    </div>
  );
}
