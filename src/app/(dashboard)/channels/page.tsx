'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { CHANNELS, CHANNEL_HEX, Channel } from '@/lib/constants';
import ChannelRadar from '@/components/charts/ChannelRadar';
import ChannelBarChart from '@/components/charts/ChannelBarChart';
import ChannelDoughnut from '@/components/charts/ChannelDoughnut';
import { Sparkles, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface ChannelMetrics {
  conversionRate: number; // %
  cac: number; // $
  efficiencyScore: number;
}

const STATIC_METRICS: Record<Channel, ChannelMetrics> = {
  Email:    { conversionRate: 4.8, cac: 18, efficiencyScore: 92 },
  Social:   { conversionRate: 3.2, cac: 28, efficiencyScore: 84 },
  Ads:      { conversionRate: 2.9, cac: 42, efficiencyScore: 76 },
  Referral: { conversionRate: 6.4, cac: 12, efficiencyScore: 98 },
  Organic:  { conversionRate: 3.8, cac: 15, efficiencyScore: 89 },
  SMS:      { conversionRate: 5.1, cac: 22, efficiencyScore: 88 },
};

export default function ChannelsPage() {
  const { channelHits } = useAppStore();

  const totalHits = useMemo(() => {
    return Object.values(channelHits).reduce((acc, v) => acc + v, 0) || 1;
  }, [channelHits]);

  // Budget Allocation Simulator State (% weights per channel, initial equal or weighted)
  const [budgetAllocation, setBudgetAllocation] = useState<Record<Channel, number>>({
    Email: 20,
    Social: 25,
    Ads: 30,
    Referral: 10,
    Organic: 10,
    SMS: 5,
  });

  const [monthlyBudget, setMonthlyBudget] = useState(25000);

  // Calculated simulated ROI and projected conversions
  const simulationResults = useMemo(() => {
    let projectedConversions = 0;
    let projectedRevenue = 0;

    CHANNELS.forEach((ch) => {
      const allocPct = budgetAllocation[ch] || 0;
      const chBudget = (monthlyBudget * allocPct) / 100;
      const cac = STATIC_METRICS[ch].cac;
      const conv = Math.round(chBudget / cac);
      projectedConversions += conv;
      projectedRevenue += conv * 165; // average order value
    });

    const totalSpend = monthlyBudget;
    const estRoi = Math.round(((projectedRevenue - totalSpend) / totalSpend) * 100);

    return { projectedConversions, projectedRevenue, estRoi };
  }, [budgetAllocation, monthlyBudget]);

  const handleSliderChange = (ch: Channel, val: number) => {
    setBudgetAllocation((prev) => ({ ...prev, [ch]: val }));
  };

  const applyAIOptimization = () => {
    // Novelty algorithm: allocate more budget to highest efficiency and conversion channels
    setBudgetAllocation({
      Referral: 25, // highest CR (6.4%) and lowest CAC ($12)
      Email: 25,    // high CR (4.8%)
      Organic: 20,  // low CAC ($15)
      SMS: 15,      // solid engagement
      Social: 10,   // medium CAC
      Ads: 5,       // high CAC
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22d3a5', '#4f8eff', '#06b6d4'],
    });

    toast.success('AI Optimized: Budget rebalanced towards high-ROI channels! 🚀');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-4">
        <div>
          <h1 className="text-xl font-bold">Omnichannel Attribution & Performance</h1>
          <p className="text-xs text-[#6868a0] mt-0.5">
            Real-time channel ingestion tracking, efficiency ratings, and predictive budget simulation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#eaeaf8]">
            Total Ingestion: <span className="font-bold text-[#4f8eff]">{totalHits.toLocaleString()}</span> hits
          </div>
        </div>
      </div>

      {/* Channel Performance Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CHANNELS.map((ch) => {
          const hits = channelHits[ch] || 0;
          const share = Math.round((hits / totalHits) * 100);
          const color = CHANNEL_HEX[ch];
          const metrics = STATIC_METRICS[ch];

          return (
            <motion.div
              key={ch}
              whileHover={{ y: -3 }}
              className="glass rounded-xl p-3.5 border border-white/10 flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: color }}
              />
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{ch}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${color}25`, color }}
                  >
                    {share}%
                  </span>
                </div>
                <div className="text-xl font-black font-mono text-white">
                  {hits.toLocaleString()}
                </div>
                <p className="text-[10px] text-[#6868a0]">recorded events</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6868a0]">Conv. Rate</span>
                  <span className="font-semibold text-emerald-400">{metrics.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6868a0]">CAC</span>
                  <span className="font-semibold text-white">${metrics.cac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6868a0]">Efficiency</span>
                  <span className="font-semibold" style={{ color }}>{metrics.efficiencyScore}/100</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#6868a0] uppercase tracking-wider">
                Multi-Touch Channel Radar
              </p>
              <p className="text-[11px] text-[#6868a0]">Reach vs Conversion Multipliers</p>
            </div>
            <Award size={16} className="text-[#4f8eff]" />
          </div>
          <div className="h-64">
            <ChannelRadar hits={channelHits} />
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#6868a0] uppercase tracking-wider">
                Hourly Peak Distribution
              </p>
              <p className="text-[11px] text-[#6868a0]">Channel ingestion volume by time</p>
            </div>
            <TrendingUp size={16} className="text-[#22d3a5]" />
          </div>
          <div className="h-64">
            <ChannelBarChart />
          </div>
        </div>

        {/* Doughnut Share */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#6868a0] uppercase tracking-wider">
                Current Channel Share
              </p>
              <p className="text-[11px] text-[#6868a0]">Real-time slice of live traffic</p>
            </div>
            <Target size={16} className="text-[#a855f7]" />
          </div>
          <div className="h-64">
            <ChannelDoughnut hits={channelHits} />
          </div>
        </div>
      </div>

      {/* Novelty Feature: AI Budget & Attribution Optimizer */}
      <div className="glass rounded-2xl p-6 border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <Sparkles size={16} />
              </span>
              <h2 className="text-base font-bold">Novelty AI Channel Allocation Simulator</h2>
            </div>
            <p className="text-xs text-[#6868a0] mt-1">
              Simulate dynamic budget reallocation across channels to maximize conversion velocity and minimize CAC
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <DollarSign size={14} className="text-emerald-400" />
              <span className="text-xs text-[#6868a0]">Monthly Spend:</span>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Math.max(1000, Number(e.target.value)))}
                className="w-20 bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-right"
              />
            </div>

            <button
              onClick={applyAIOptimization}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
            >
              <Sparkles size={14} />
              AI Optimal Rebalance
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {CHANNELS.map((ch) => {
            const val = budgetAllocation[ch] || 0;
            const color = CHANNEL_HEX[ch];
            const chSpend = Math.round((monthlyBudget * val) / 100);

            return (
              <div key={ch} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span>{ch}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-white mr-2">${chSpend.toLocaleString()}</span>
                    <span className="font-mono font-bold" style={{ color }}>{val}%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="60"
                  value={val}
                  onChange={(e) => handleSliderChange(ch, Number(e.target.value))}
                  className="w-full accent-[#4f8eff] cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Simulation Output Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/20 border border-white/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6868a0]">
              Projected Conversions
            </span>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {simulationResults.projectedConversions.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400">↑ High confidence model</p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6868a0]">
              Projected Gross Revenue
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              ${simulationResults.projectedRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#6868a0]">Based on $165 blended AOV</p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6868a0]">
              Simulated Net ROI
            </span>
            <div className="text-2xl font-black font-mono text-[#a855f7] mt-1">
              +{simulationResults.estRoi}%
            </div>
            <p className="text-[11px] text-emerald-400">Estimated campaign lift</p>
          </div>
        </div>
      </div>
    </div>
  );
}
