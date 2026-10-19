'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import DemandWave from '@/components/charts/DemandWave';
import { MONTHS } from '@/lib/constants';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Activity, Flame, ShieldAlert, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DemandPage() {
  const { kpis, demandHistory } = useAppStore();

  // Simulation Controls for Demand Spike Predictor
  const [spendMultiplier, setSpendMultiplier] = useState(1.4); // 1.0x to 3.0x
  const [priceElasticity, setPriceElasticity] = useState(-0.8); // -2.0 to -0.2
  const [seasonalityFactor, setSeasonalityFactor] = useState(1.2); // 0.8x to 2.0x

  // Dynamic forecast calculations based on simulation levers
  const forecastData = useMemo(() => {
    // 12 historical months
    const data = demandHistory.map((val, idx) => ({
      month: MONTHS[idx],
      actual: val as number | null,
      forecast: null as number | null,
      upperBound: null as number | null,
      lowerBound: null as number | null,
    }));

    // Next 3 projected months
    const lastActual = demandHistory[demandHistory.length - 1] || 85;
    const futureMonths = ['Jan (Next)', 'Feb (Next)', 'Mar (Next)'];

    futureMonths.forEach((m, idx) => {
      const step = idx + 1;
      // Formula incorporates marketing boost, price elasticity offset, and seasonal wave
      const growthFactor = (spendMultiplier - 1) * 12 + (priceElasticity + 1) * 8 + (seasonalityFactor - 1) * 15;
      const projected = Math.min(100, Math.max(20, Math.round(lastActual + growthFactor * step * 0.4)));
      const uncertainty = step * 4;

      data.push({
        month: m,
        actual: null,
        forecast: projected,
        upperBound: Math.min(100, projected + uncertainty),
        lowerBound: Math.max(0, projected - uncertainty),
      });
    });

    return data;
  }, [demandHistory, spendMultiplier, priceElasticity, seasonalityFactor]);

  const peakDemand = useMemo(() => {
    const projectedVals = forecastData
      .map((d) => d.forecast)
      .filter((v): v is number => v !== null);
    return Math.max(...projectedVals, Math.round(kpis.demand));
  }, [forecastData, kpis.demand]);

  const resetSliders = () => {
    setSpendMultiplier(1.0);
    setPriceElasticity(-0.8);
    setSeasonalityFactor(1.0);
    toast.success('Simulation parameters reset to baseline');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Predictive Demand & Elasticity Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
              Demand Index: {kpis.demand}%
            </span>
          </div>
          <p className="text-xs text-[#6868a0] mt-0.5">
            Real-time algorithmic demand forecasting, capacity thresholds, and elasticity models
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-[#6868a0]">Current Velocity:</span>
            <span className="font-mono font-bold text-white">+3.4% / wk</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Demand Index</span>
            <Flame size={16} className="text-orange-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{kpis.demand}%</div>
          <div className="text-[11px] text-emerald-400 mt-1">↑ 4.2% above baseline</div>
        </div>

        <div className="glass rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Peak Forecast</span>
            <Sparkles size={16} className="text-[#4f8eff]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#4f8eff]">{peakDemand}%</div>
          <div className="text-[11px] text-[#6868a0] mt-1">Expected Q1 peak</div>
        </div>

        <div className="glass rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Capacity Status</span>
            <Cpu size={16} className="text-[#22d3a5]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#22d3a5]">Optimal</div>
          <div className="text-[11px] text-[#6868a0] mt-1">Infrastructure head-room: 42%</div>
        </div>

        <div className="glass rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Surge Alert Risk</span>
            <ShieldAlert size={16} className={peakDemand > 90 ? 'text-rose-400' : 'text-amber-400'} />
          </div>
          <div className={`text-2xl font-black font-mono ${peakDemand > 90 ? 'text-rose-400' : 'text-amber-400'}`}>
            {peakDemand > 90 ? 'High' : 'Moderate'}
          </div>
          <div className="text-[11px] text-[#6868a0] mt-1">
            {peakDemand > 90 ? 'Resource autoscaling recommended' : 'Within tolerance'}
          </div>
        </div>
      </div>

      {/* Main Forecast Chart with Confidence Band */}
      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#6868a0]">
              Dynamic Demand Horizon & Predictive Cone
            </h2>
            <p className="text-xs text-white mt-0.5">
              Historical 12-Month Ingestion vs 90-Day Projected Confidence Interval
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400" /> Historical
            </span>
            <span className="flex items-center gap-1.5 text-[#4f8eff]">
              <span className="w-2.5 h-0.5 bg-[#4f8eff] stroke-dasharray" /> AI Forecast
            </span>
            <span className="flex items-center gap-1.5 text-[#a855f7]/60">
              <span className="w-2.5 h-2.5 bg-[#a855f7]/30 rounded-sm" /> Confidence Interval
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(13,13,38,0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  color: '#eaeaf8',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="upperBound"
                fill="#a855f7"
                fillOpacity={0.08}
                stroke="transparent"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#22d3a5"
                strokeWidth={2.5}
                dot={{ fill: '#22d3a5', r: 3 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#4f8eff"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ fill: '#4f8eff', r: 4 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Novelty Feature: Interactive Demand Surge & Elasticity Simulator */}
      <div className="glass rounded-2xl p-6 border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                <Flame size={16} />
              </span>
              <h2 className="text-base font-bold">Novelty Demand Surge & Elasticity Simulator</h2>
            </div>
            <p className="text-xs text-[#6868a0] mt-1">
              Test how marketing campaigns, price changes, and seasonal shifts impact system demand in real time
            </p>
          </div>

          <button
            onClick={resetSliders}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-[#6868a0] hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
            Reset Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Slider 1: Marketing Spend Multiplier */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#eaeaf8]">Marketing Spend Boost</span>
              <span className="font-mono text-[#4f8eff]">{spendMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={spendMultiplier}
              onChange={(e) => setSpendMultiplier(parseFloat(e.target.value))}
              className="w-full accent-[#4f8eff] cursor-pointer"
            />
            <p className="text-[10px] text-[#6868a0]">
              Increases acquisition event velocity across all primary channels
            </p>
          </div>

          {/* Slider 2: Price Elasticity */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#eaeaf8]">Price Elasticity (PED)</span>
              <span className="font-mono text-[#a855f7]">{priceElasticity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2.0"
              max="-0.2"
              step="0.1"
              value={priceElasticity}
              onChange={(e) => setPriceElasticity(parseFloat(e.target.value))}
              className="w-full accent-[#a855f7] cursor-pointer"
            />
            <p className="text-[10px] text-[#6868a0]">
              Sensitivity of customer conversion rates to pricing adjustments
            </p>
          </div>

          {/* Slider 3: Seasonality Index */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#eaeaf8]">Seasonality Coefficient</span>
              <span className="font-mono text-emerald-400">{seasonalityFactor.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={seasonalityFactor}
              onChange={(e) => setSeasonalityFactor(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-[#6868a0]">
              Holiday or cyclical quarter-end demand surge multiplier
            </p>
          </div>
        </div>

        {/* Dynamic Capacity Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/20 border border-white/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6868a0]">
              Recommended Support Staff
            </span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {Math.round(8 * spendMultiplier * seasonalityFactor)} Agents
            </div>
            <p className="text-[10px] text-emerald-400">To maintain &lt; 2 min response time</p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6868a0]">
              Server Auto-Scale Nodes
            </span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {Math.max(4, Math.round(6 * (peakDemand / 70)))} Instances
            </div>
            <p className="text-[10px] text-[#6868a0]">Kubernetes HPA target: 70% CPU</p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6868a0]">
              Demand Strain Status
            </span>
            <div className="text-xl font-bold font-mono text-orange-400 mt-1">
              {peakDemand > 90 ? 'High Pressure' : 'Normal Load'}
            </div>
            <p className="text-[10px] text-emerald-400">Zero drop-off projected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
