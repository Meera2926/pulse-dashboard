'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface Props {
  icon: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: string;
  deltaUp?: boolean;
  glowColor: string;
  sparkData: number[];
  flashColor?: string;
}

export default function KpiCard({ icon, label, value, prefix = '', suffix = '', delta, deltaUp = true, glowColor, sparkData, flashColor }: Props) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(value);

  // Animated counter
  useEffect(() => {
    if (value === prevRef.current) return;
    setFlash(true);
    const from = prevRef.current, to = value, dur = 500, start = performance.now();
    const step = (ts: number) => {
      const p = Math.min((ts - start) / dur, 1), e = 1 - (1 - p) ** 3;
      setDisplay(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    prevRef.current = value;
    const t = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: `0 12px 40px rgba(0,0,0,0.3)` }}
      transition={{ duration: 0.2 }}
      className="glass rounded-2xl p-5 cursor-default transition-all"
      style={flash ? { borderColor: flashColor ?? glowColor, boxShadow: `0 0 24px ${glowColor}44` } : {}}
    >
      {/* Glow blob */}
      <div className="absolute w-16 h-16 rounded-full -top-4 -right-4 blur-3xl opacity-40 pointer-events-none" style={{ background: glowColor }} />

      <span className="text-2xl block mb-2">{icon}</span>
      <div className="text-2xl font-black font-mono leading-none" style={{ background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {prefix}{display >= 1000 ? display.toLocaleString() : display}{suffix}
      </div>
      <p className="text-xs text-[#6868a0] mt-1.5">{label}</p>
      <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${deltaUp ? 'text-[#22d3a5]' : 'text-[#fb923c]'}`}>
        {deltaUp ? <TrendingUp size={11}/> : '↓'}{delta}
      </p>

      {/* Sparkline */}
      {sparkData.length > 1 && (
        <svg className="w-full mt-3" height="32" viewBox={`0 0 ${sparkData.length - 1} 32`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={glowColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const min = Math.min(...sparkData), max = Math.max(...sparkData);
            const range = max - min || 1;
            const pts = sparkData.map((v, i) => `${i},${32 - ((v - min) / range) * 28}`).join(' ');
            const fill = `${pts} ${sparkData.length - 1},32 0,32`;
            return <>
              <polygon points={fill} fill={`url(#sg-${label})`} />
              <polyline points={pts} fill="none" stroke={glowColor} strokeWidth="1.5" strokeLinejoin="round" />
            </>;
          })()}
        </svg>
      )}
    </motion.div>
  );
}
