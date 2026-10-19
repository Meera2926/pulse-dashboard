'use client';
import { motion } from 'framer-motion';

interface Stage { label: string; pct: number; color: string; }

export default function FunnelChart({ stages }: { stages: Stage[] }) {
  return (
    <div className="space-y-4">
      {stages.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <div className="w-24 text-xs font-medium text-[#6868a0] flex-shrink-0">{s.label}</div>
          <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.34, 1.2, 0.64, 1] }}
              className="h-full rounded-lg flex items-center justify-end pr-2.5 text-xs font-bold text-white"
              style={{ background: s.color }}
            >
              {s.pct}%
            </motion.div>
          </div>
          <div className="text-xs font-bold w-10 text-right" style={{ color: s.color }}>{s.pct}%</div>
        </div>
      ))}
    </div>
  );
}
