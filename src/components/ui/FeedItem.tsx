'use client';
import { motion } from 'framer-motion';
import { CHANNEL_HEX, TYPE_HEX, TYPE_ICONS } from '@/lib/constants';
import type { LiveEvent } from '@/lib/eventGenerator';

interface Props { event: LiveEvent; }

export default function FeedItem({ event }: Props) {
  const chHex = CHANNEL_HEX[event.channel];
  const tyHex = TYPE_HEX[event.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.34, 1.4, 0.64, 1] }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors hover:bg-white/5 flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      {/* Icon badge */}
      <div className="w-9 h-9 min-w-[36px] rounded-xl flex items-center justify-center text-lg"
        style={{ background: `${chHex}22`, border: `1px solid ${chHex}66` }}>
        {TYPE_ICONS[event.type]}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: chHex }}>{event.channel}</p>
        <p className="text-sm font-semibold truncate">{event.detail}</p>
        <p className="text-[10px] text-[#6868a0] font-mono">{event.time}</p>
      </div>

      {/* Type tag */}
      <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap"
        style={{ background: `${tyHex}28`, color: tyHex }}>
        {event.type}
      </span>
    </motion.div>
  );
}
