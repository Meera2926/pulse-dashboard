import { create } from 'zustand';
import { LiveEvent, generateEvent } from '@/lib/eventGenerator';
import { Channel, CHANNELS, EventType } from '@/lib/constants';

interface KPIs {
  signups: number;
  revenue: number;
  feedback: number;
  demand: number;
  todaySignups: number;
  todayRevenue: number;
  todayFeedback: number;
  churnAlerts: number;
}

interface AppState {
  // Auth
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  login: (name: string, email: string) => void;
  logout: () => void;

  // Events
  events: LiveEvent[];
  totalEvents: number;
  addEvent: (e: LiveEvent) => void;
  addCustomEvent: (ev: { channel: Channel; type: EventType; detail: string; amount: number }) => void;
  triggerSurge: (count?: number) => void;
  resetEvents: () => void;

  // KPIs
  kpis: KPIs;

  // Channel hits
  channelHits: Record<Channel, number>;

  // Demand history (12 months)
  demandHistory: number[];

  // Sparkline data
  sparkSignup: number[];
  sparkRevenue: number[];
  sparkFeedback: number[];
  sparkDemand: number[];

  // Simulation control
  isSimulating: boolean;
  setSimulating: (v: boolean) => void;
  simulationSpeed: number; // in ms
  setSimulationSpeed: (speed: number) => void;

  // Retention / Churn management
  resolvedChurnIds: string[];
  resolveChurn: (id: string) => void;

  // Tick: called by the simulation loop
  tick: () => void;
}

const rn = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1) + lo);
const pushSpark = (arr: number[], val: number) => [...arr.slice(-19), val];

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  userName: 'Meera K.',
  userEmail: 'admin@pulse.io',
  login: (name, email) => set({ isLoggedIn: true, userName: name, userEmail: email }),
  logout: () => set({ isLoggedIn: false, userName: '', userEmail: '' }),

  events: [],
  totalEvents: 0,
  addEvent: (e) =>
    set((s) => ({
      events: [e, ...s.events].slice(0, 300),
      totalEvents: s.totalEvents + 1,
    })),

  addCustomEvent: ({ channel, type, detail, amount }) => {
    const ev: LiveEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      channel,
      type,
      detail,
      amount,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
    };
    const s = get();
    const kpis = { ...s.kpis };
    if (type === 'Sign-up')    { kpis.signups++;  kpis.todaySignups++; }
    if (type === 'Purchase')   { kpis.revenue += amount; kpis.todayRevenue += amount; }
    if (type === 'Feedback')   { kpis.feedback++; kpis.todayFeedback++; }
    if (type === 'Churn Risk') { kpis.churnAlerts++; }
    kpis.demand = parseFloat(Math.min(99, Math.max(50, kpis.demand + 0.4)).toFixed(1));

    const channelHits = { ...s.channelHits };
    channelHits[channel] = (channelHits[channel] || 0) + 1;

    set({
      events: [ev, ...s.events].slice(0, 300),
      totalEvents: s.totalEvents + 1,
      kpis,
      channelHits,
      sparkSignup:   pushSpark(s.sparkSignup,   kpis.todaySignups),
      sparkRevenue:  pushSpark(s.sparkRevenue,  kpis.todayRevenue / 100),
      sparkFeedback: pushSpark(s.sparkFeedback, kpis.todayFeedback),
      sparkDemand:   pushSpark(s.sparkDemand,   kpis.demand),
    });
  },

  triggerSurge: (count = 8) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        get().tick();
      }, i * 150);
    }
  },

  resetEvents: () => {
    set({
      events: [],
      totalEvents: 0,
      channelHits: Object.fromEntries(CHANNELS.map((c) => [c, rn(40, 100)])) as Record<Channel, number>,
      kpis: {
        signups: 1240, revenue: 58320, feedback: 342, demand: 72,
        todaySignups: 0, todayRevenue: 0, todayFeedback: 0, churnAlerts: 0,
      },
    });
  },

  kpis: {
    signups: 1240, revenue: 58320, feedback: 342, demand: 72,
    todaySignups: 0, todayRevenue: 0, todayFeedback: 0, churnAlerts: 0,
  },

  channelHits: Object.fromEntries(
    CHANNELS.map((c) => [c, rn(80, 220)])
  ) as Record<Channel, number>,

  demandHistory: [62, 65, 70, 68, 74, 71, 76, 79, 77, 82, 80, 85],

  sparkSignup: Array(20).fill(0),
  sparkRevenue: Array(20).fill(0),
  sparkFeedback: Array(20).fill(0),
  sparkDemand: Array(20).fill(72),

  isSimulating: true,
  setSimulating: (v) => set({ isSimulating: v }),
  simulationSpeed: 2000,
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  resolvedChurnIds: [],
  resolveChurn: (id) =>
    set((s) => ({
      resolvedChurnIds: [...s.resolvedChurnIds, id],
      kpis: { ...s.kpis, churnAlerts: Math.max(0, s.kpis.churnAlerts - 1) },
    })),

  tick: () => {
    const ev = generateEvent();
    const s = get();

    const kpis = { ...s.kpis };
    if (ev.type === 'Sign-up')    { kpis.signups++;  kpis.todaySignups++; }
    if (ev.type === 'Purchase')   { kpis.revenue += ev.amount; kpis.todayRevenue += ev.amount; }
    if (ev.type === 'Feedback')   { kpis.feedback++; kpis.todayFeedback++; }
    if (ev.type === 'Churn Risk') { kpis.churnAlerts++; }
    kpis.demand = parseFloat(Math.min(99, Math.max(50, kpis.demand + (Math.random() > 0.42 ? 0.3 : -0.1))).toFixed(1));

    const channelHits = { ...s.channelHits };
    channelHits[ev.channel] = (channelHits[ev.channel] || 0) + 1;

    const demandHistory = [...s.demandHistory];
    demandHistory[11] = parseFloat(Math.min(99, Math.max(50, demandHistory[11] + (Math.random() - 0.4) * 2)).toFixed(1));

    set({
      events: [ev, ...s.events].slice(0, 300),
      totalEvents: s.totalEvents + 1,
      kpis,
      channelHits,
      demandHistory,
      sparkSignup:  pushSpark(s.sparkSignup,  kpis.todaySignups),
      sparkRevenue: pushSpark(s.sparkRevenue, kpis.todayRevenue / 100),
      sparkFeedback:pushSpark(s.sparkFeedback,kpis.todayFeedback),
      sparkDemand:  pushSpark(s.sparkDemand,  kpis.demand),
    });
  },
}));
