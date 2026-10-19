import { Channel, EventType, CHANNELS, EVENT_TYPES, NAMES, PRODUCTS, FEEDBACKS } from './constants';

export interface LiveEvent {
  id: string;
  channel: Channel;
  type: EventType;
  detail: string;
  amount: number;
  time: string;
  timestamp: number;
}

const rand = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rn = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1) + lo);

export function generateEvent(): LiveEvent {
  const channel = rand(CHANNELS);
  const type = rand(EVENT_TYPES);
  const name = rand(NAMES);
  let detail = '';
  let amount = 0;

  if (type === 'Purchase') {
    amount = rn(19, 299);
    detail = `${name} bought ${rand(PRODUCTS)} — $${amount}`;
  } else if (type === 'Sign-up') {
    detail = `${name} joined via ${channel}`;
  } else if (type === 'Feedback') {
    detail = rand(FEEDBACKS);
  } else if (type === 'Churn Risk') {
    detail = `${name} inactive for ${rn(7, 28)} days`;
  } else {
    detail = `${name} eligible for ${rand(PRODUCTS)} upsell`;
  }

  const now = new Date();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    channel,
    type,
    detail,
    amount,
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    timestamp: now.getTime(),
  };
}
