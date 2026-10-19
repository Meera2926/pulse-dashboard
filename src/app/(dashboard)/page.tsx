'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import KpiCard from '@/components/ui/KpiCard';
import FeedItem from '@/components/ui/FeedItem';
import DemandWave from '@/components/charts/DemandWave';
import ChannelDoughnut from '@/components/charts/ChannelDoughnut';
import dynamic from 'next/dynamic';

const FunnelChart = dynamic(() => import('@/components/ui/FunnelChart'), { ssr: false });

const FUNNEL = [
  { label: 'Visitors',  pct: 100, color: '#4f8eff' },
  { label: 'Sign-ups',  pct: 38,  color: '#a855f7' },
  { label: 'Activated', pct: 24,  color: '#06b6d4' },
  { label: 'Purchased', pct: 12,  color: '#22d3a5' },
  { label: 'Retained',  pct: 8,   color: '#fb923c' },
];

const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function OverviewPage() {
  const { kpis, events, channelHits, demandHistory, sparkSignup, sparkRevenue, sparkFeedback, sparkDemand } = useAppStore();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* KPI Row */}
      <motion.div variants={card} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon="👤" label="Total Sign-ups"  value={kpis.signups}  prefix=""  delta={`+${kpis.todaySignups} today`}  glowColor="#4f8eff" sparkData={sparkSignup}  flashColor="#4f8eff" />
        <KpiCard icon="💰" label="Revenue"          value={kpis.revenue}  prefix="$" delta={`+$${kpis.todayRevenue} today`} glowColor="#22d3a5" sparkData={sparkRevenue} flashColor="#22d3a5" />
        <KpiCard icon="💬" label="Feedback Items"   value={kpis.feedback} prefix=""  delta={`+${kpis.todayFeedback} today`} glowColor="#a855f7" sparkData={sparkFeedback} flashColor="#a855f7" />
        <KpiCard icon="📈" label="Demand Index"     value={Math.round(kpis.demand)} suffix="%" delta="↑ trending up" glowColor="#fb923c" sparkData={sparkDemand} flashColor="#fb923c" />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={card} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <p className="text-xs font-bold text-[#6868a0] uppercase tracking-widest mb-3">Demand Wave — 12 months</p>
          <div className="h-52"><DemandWave data={demandHistory} /></div>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-bold text-[#6868a0] uppercase tracking-widest mb-3">Channel Split</p>
          <div className="h-52"><ChannelDoughnut hits={channelHits} /></div>
        </div>
      </motion.div>

      {/* Feed + Funnel */}
      <motion.div variants={card} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">⚡ Live Event Feed</p>
            <span className="text-xs text-[#6868a0]">{events.length} events</span>
          </div>
          <div className="flex flex-col gap-2 h-72 overflow-y-auto pr-1">
            {events.slice(0, 20).map(e => <FeedItem key={e.id} event={e} />)}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <p className="text-sm font-bold mb-4">🔽 Acquisition Funnel</p>
          <FunnelChart stages={FUNNEL} />
        </div>
      </motion.div>
    </motion.div>
  );
}
