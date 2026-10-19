'use client';
import { CHANNELS, CHANNEL_HEX } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';

export default function LiveTicker() {
  const channelHits = useAppStore((s) => s.channelHits);

  const items = CHANNELS.map(c => ({
    label: c, hex: CHANNEL_HEX[c], hits: channelHits[c] ?? 0,
  }));
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="flex items-center gap-4 px-5 py-2.5 border-t flex-shrink-0 text-xs overflow-hidden"
      style={{ background: 'rgba(7,7,26,0.7)', borderColor: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(10px)' }}>
      <span className="font-bold text-[10px] uppercase tracking-widest text-[#4f8eff] whitespace-nowrap flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22d3a5] animate-blink" />
        Live
      </span>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-12 whitespace-nowrap animate-ticker" style={{ width: 'max-content' }}>
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-[#6868a0]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.hex }} />
              <span style={{ color: item.hex }} className="font-semibold">{item.label}</span>
              — {item.hits.toLocaleString()} events
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
