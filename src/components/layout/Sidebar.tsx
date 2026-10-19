'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Radio } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalEvents, userName, logout } = useAppStore();

  const handleLogout = () => {
    document.cookie = 'pulse_auth=; path=/; max-age=0';
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-[230px] min-w-[230px] flex flex-col border-r z-20 relative" style={{ background: 'rgba(7,7,26,0.9)', borderColor: 'rgba(255,255,255,0.09)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 animate-logo" style={{ background: 'linear-gradient(135deg,#4f8eff,#a855f7)' }}>
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-xl font-black tracking-tight">Pulse<span className="text-[#4f8eff]">.</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-bold text-[#6868a0] uppercase tracking-widest">Main</p>
        {NAV_ITEMS.slice(0, 4).map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm font-medium transition-all cursor-pointer relative ${active ? 'text-[#4f8eff] font-semibold' : 'text-[#6868a0] hover:text-white hover:bg-white/5'}`}
                style={active ? { background: 'rgba(79,142,255,0.12)' } : {}}>
                {active && <motion.div layoutId="nav-active" className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-r bg-[#4f8eff]" />}
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
                {item.href === '/events' && totalEvents > 0 && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[rgba(79,142,255,0.2)] text-[#4f8eff]">
                    {totalEvents > 999 ? '1k+' : totalEvents}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        <p className="px-3 py-2 mt-2 text-[10px] font-bold text-[#6868a0] uppercase tracking-widest">Insights</p>
        {NAV_ITEMS.slice(4).map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-sm font-medium transition-all cursor-pointer relative ${active ? 'text-[#4f8eff] font-semibold' : 'text-[#6868a0] hover:text-white hover:bg-white/5'}`}
                style={active ? { background: 'rgba(79,142,255,0.12)' } : {}}>
                {active && <motion.div layoutId="nav-active" className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-r bg-[#4f8eff]" />}
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#22d3a5] animate-blink" />
          <span className="text-[11px] text-[#22d3a5] font-bold uppercase tracking-wider">Live</span>
          <Radio size={12} className="text-[#22d3a5] ml-auto" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg,#4f8eff,#a855f7)' }}>
            {userName?.[0] ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{userName || 'User'}</p>
            <p className="text-[10px] text-[#6868a0]">Admin</p>
          </div>
          <button onClick={handleLogout} className="text-[#6868a0] hover:text-white transition-colors text-[10px]" title="Logout">⏻</button>
        </div>
      </div>
    </aside>
  );
}
