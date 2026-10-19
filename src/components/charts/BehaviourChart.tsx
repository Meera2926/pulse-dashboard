'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MONTHS, EVENT_TYPES, TYPE_HEX } from '@/lib/constants';

const DATA = MONTHS.map((m, idx) => ({
  month: m,
  'Sign-up': Math.round(30 + Math.sin(idx * 0.5) * 15 + idx * 3),
  'Purchase': Math.round(20 + Math.cos(idx * 0.4) * 10 + idx * 4),
  'Feedback': Math.round(15 + Math.sin(idx * 0.3) * 8 + idx * 1.5),
  'Churn Risk': Math.round(12 + Math.cos(idx * 0.6) * 5),
  'Upsell': Math.round(10 + Math.sin(idx * 0.7) * 7 + idx * 2),
}));

export default function BehaviourChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: 'rgba(13,13,38,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#eaeaf8', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 10, color: '#6868a0' }} />
        {EVENT_TYPES.map(t => (
          <Line key={t} type="monotone" dataKey={t} stroke={TYPE_HEX[t]} strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
