'use client';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { NAV_ITEMS } from '@/lib/constants';

const PAGE_SUBTITLES: Record<string, string> = {
  '/':          '— Customer Intelligence Hub',
  '/events':    '— Real-time stream',
  '/channels':  '— Reach & performance',
  '/demand':    '— Forecasting & trends',
  '/customers': '— Intelligence & insights',
  '/heatmap':   '— Event intensity',
  '/settings':  '— Preferences',
  '/dashboard': '— Customer Intelligence Hub',
};

export default function Topbar() {
  const pathname = usePathname();
  const [clock, setClock] = useState('');
  const kpis = useAppStore((s) => s.kpis);
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const title = NAV_ITEMS.find(n => n.href === pathname)?.label ?? 'Overview';
  const sub = PAGE_SUBTITLES[pathname] ?? '';

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0 z-10 relative" style={{ background: 'rgba(7,7,26,0.8)', borderColor: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)' }}>
      <div>
        <h2 className="text-base font-bold leading-none">
          {title} <span className="text-[#6868a0] font-normal text-sm">{sub}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick KPI pills */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full font-mono font-bold" style={{ background: 'rgba(34,211,165,0.12)', color: '#22d3a5' }}>
            ${(kpis.revenue / 1000).toFixed(1)}k rev
          </span>
          <span className="px-2.5 py-1 rounded-full font-mono font-bold" style={{ background: 'rgba(79,142,255,0.12)', color: '#4f8eff' }}>
            {kpis.signups.toLocaleString()} users
          </span>
        </div>

        {/* Clock */}
        <span className="font-mono text-xs text-[#6868a0]">{clock}</span>

        {/* Notification bell */}
        <button onClick={() => setHasNotif(false)} className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <Bell size={15} className="text-[#6868a0]" />
          {hasNotif && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-blink" />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer" style={{ background: 'linear-gradient(135deg,#4f8eff,#a855f7)' }}>
          MK
        </div>
      </div>
    </header>
  );
}
