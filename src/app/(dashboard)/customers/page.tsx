'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import SentimentChart from '@/components/charts/SentimentChart';
import BehaviourChart from '@/components/charts/BehaviourChart';
import FunnelChart from '@/components/ui/FunnelChart';
import { Users, AlertTriangle, ShieldCheck, HeartHandshake, Gift, PhoneCall, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface AtRiskCustomer {
  id: string;
  name: string;
  company: string;
  plan: string;
  mrr: number;
  riskScore: number;
  primaryRiskReason: string;
  channel: string;
}

const INITIAL_CHURN_ACCOUNTS: AtRiskCustomer[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    company: 'Apex Logistics',
    plan: 'Enterprise',
    mrr: 1200,
    riskScore: 89,
    primaryRiskReason: 'Drop in active seats (-60% last 14d)',
    channel: 'Email',
  },
  {
    id: 'cust-2',
    name: 'David Chen',
    company: 'Nexus FinTech',
    plan: 'Pro Plan',
    mrr: 450,
    riskScore: 81,
    primaryRiskReason: 'Reported repeated onboarding friction',
    channel: 'Social',
  },
  {
    id: 'cust-3',
    name: 'Elena Rostova',
    company: 'Quantum Media',
    plan: 'Growth Bundle',
    mrr: 890,
    riskScore: 76,
    primaryRiskReason: 'Zero dashboard logins in 21 days',
    channel: 'Ads',
  },
  {
    id: 'cust-4',
    name: 'Marcus Vance',
    company: 'Hyperion Labs',
    plan: 'Enterprise',
    mrr: 2400,
    riskScore: 72,
    primaryRiskReason: 'Billing payment retry warning',
    channel: 'SMS',
  },
];

const FUNNEL_DATA = [
  { label: 'Visitors',  pct: 100, color: '#4f8eff' },
  { label: 'Sign-ups',  pct: 38,  color: '#a855f7' },
  { label: 'Activated', pct: 24,  color: '#06b6d4' },
  { label: 'Purchased', pct: 12,  color: '#22d3a5' },
  { label: 'Retained',  pct: 8,   color: '#fb923c' },
];

export default function CustomersPage() {
  const { kpis, events, resolvedChurnIds, resolveChurn } = useAppStore();

  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);

  const handleIntervention = (customerId: string, customerName: string, actionName: string) => {
    setActiveIntervention(customerId);
    setTimeout(() => {
      resolveChurn(customerId);
      setActiveIntervention(null);
      toast.success(`${actionName} applied for ${customerName}! Churn threat mitigated 🎉`);
    }, 600);
  };

  const feedbackEvents = events.filter((e) => e.type === 'Feedback' || e.type === 'Churn Risk').slice(0, 8);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Customer Journey & Sentiment Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Net NPS: +58
            </span>
          </div>
          <p className="text-xs text-[#6868a0] mt-0.5">
            Full-funnel conversion analysis, sentiment telemetry, and AI proactive retention system
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#eaeaf8]">
            Active Monitored Accounts: <span className="font-bold text-white">4,820</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 border border-white/10">
          <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Total Customers</span>
          <div className="text-2xl font-black font-mono text-white mt-1">4,820</div>
          <p className="text-[11px] text-emerald-400 mt-1">↑ +14.2% QoQ growth</p>
        </div>

        <div className="glass rounded-xl p-4 border border-white/10">
          <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Average LTV</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">$3,420</div>
          <p className="text-[11px] text-[#6868a0] mt-1">Gross payback: 2.1 mos</p>
        </div>

        <div className="glass rounded-xl p-4 border border-white/10">
          <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Monthly Churn Rate</span>
          <div className="text-2xl font-black font-mono text-[#4f8eff] mt-1">1.8%</div>
          <p className="text-[11px] text-emerald-400 mt-1">↓ 0.4% lower than industry avg</p>
        </div>

        <div className="glass rounded-xl p-4 border border-white/10">
          <span className="text-xs font-semibold text-[#6868a0] uppercase tracking-wider">Threats Detected</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {Math.max(0, INITIAL_CHURN_ACCOUNTS.length - resolvedChurnIds.length)} Accounts
          </div>
          <p className="text-[11px] text-[#6868a0] mt-1">Requires proactive outreach</p>
        </div>
      </div>

      {/* Funnel & Sentiment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversion Funnel */}
        <div className="glass rounded-2xl p-5 lg:col-span-2 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#6868a0]">
                Customer Conversion Lifecycle Funnel
              </h2>
              <p className="text-xs text-white mt-0.5">Stage-by-stage progression from First Touch to Retention</p>
            </div>
            <Users size={16} className="text-[#4f8eff]" />
          </div>
          <div className="py-2">
            <FunnelChart stages={FUNNEL_DATA} />
          </div>
        </div>

        {/* Sentiment Doughnut */}
        <div className="glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#6868a0]">
                  Real-Time Sentiment
                </h2>
                <p className="text-xs text-white mt-0.5">NLP classified user sentiment</p>
              </div>
              <HeartHandshake size={16} className="text-[#22d3a5]" />
            </div>
            <div className="h-52">
              <SentimentChart />
            </div>
          </div>
          <div className="text-center pt-2 border-t border-white/10 text-xs text-[#6868a0]">
            <span className="text-emerald-400 font-bold">68% Positive</span> feedback rating
          </div>
        </div>
      </div>

      {/* Novelty Feature: AI Predictive Churn Early-Warning Matrix */}
      <div className="glass rounded-2xl p-6 border border-white/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-600 text-white">
                <AlertTriangle size={16} />
              </span>
              <h2 className="text-base font-bold">Novelty AI Churn Early-Warning Matrix</h2>
            </div>
            <p className="text-xs text-[#6868a0] mt-1">
              Real-time anomaly detection identifying disengaging accounts before cancellation occurs. Execute instant one-click retention campaigns.
            </p>
          </div>

          <div className="text-xs text-[#6868a0]">
            Saved MRR this session:{' '}
            <span className="font-mono font-bold text-emerald-400">
              ${resolvedChurnIds.length * 1100} / mo
            </span>
          </div>
        </div>

        <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden bg-black/20">
          {INITIAL_CHURN_ACCOUNTS.map((account) => {
            const isResolved = resolvedChurnIds.includes(account.id);
            const isProcessing = activeIntervention === account.id;

            return (
              <motion.div
                key={account.id}
                layout
                className={`p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all ${
                  isResolved ? 'bg-emerald-950/20' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isResolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {isResolved ? <Check size={18} /> : `${account.riskScore}%`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{account.name}</span>
                      <span className="text-xs text-[#6868a0]">({account.company})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-[#eaeaf8]">
                        {account.plan}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300/90 mt-1 flex items-center gap-1">
                      <span className="text-xs">⚠️</span> {account.primaryRiskReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-3 hidden sm:block">
                    <div className="text-xs font-mono font-bold text-white">${account.mrr}/mo</div>
                    <div className="text-[10px] text-[#6868a0]">Touchpoint: {account.channel}</div>
                  </div>

                  {isResolved ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <ShieldCheck size={14} />
                      Retention Campaign Active
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleIntervention(account.id, account.name, '20% Loyalty Retention Offer')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/15 hover:bg-white/10 text-white transition-all hover:scale-[1.02]"
                      >
                        <Gift size={13} className="text-[#a855f7]" />
                        Deploy 20% Offer
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() => handleIntervention(account.id, account.name, 'Priority CSM Outreach')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
                      >
                        <PhoneCall size={13} />
                        Trigger VIP Outreach
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Customer Event & Feedback Log */}
      <div className="glass rounded-2xl p-5 border border-white/10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#6868a0] mb-3">
          Recent User Reviews & Feedback Ingestion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {feedbackEvents.map((e) => (
            <div key={e.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <span className="text-xl">💬</span>
              <div>
                <p className="text-xs font-medium text-white">{e.detail}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6868a0]">
                  <span className="text-[#4f8eff] font-semibold">{e.channel}</span>
                  <span>•</span>
                  <span>{e.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
