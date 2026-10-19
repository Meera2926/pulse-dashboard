'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CHANNELS, CHANNEL_HEX } from '@/lib/constants';
import type { Channel } from '@/lib/constants';

const STATIC_DATA = [
  { hour: '6am',  Email: 32, Social: 45, Ads: 28, Referral: 15 },
  { hour: '9am',  Email: 85, Social: 62, Ads: 74, Referral: 38 },
  { hour: '12pm', Email: 95, Social: 88, Ads: 92, Referral: 54 },
  { hour: '3pm',  Email: 78, Social: 94, Ads: 86, Referral: 49 },
  { hour: '6pm',  Email: 64, Social: 110, Ads: 98, Referral: 62 },
  { hour: '9pm',  Email: 42, Social: 78, Ads: 65, Referral: 34 },
];

export default function ChannelBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={STATIC_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="hour" tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: 'rgba(13,13,38,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#eaeaf8', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#6868a0' }} />
        {(CHANNELS.slice(0, 4) as Channel[]).map(c => (
          <Bar key={c} dataKey={c} fill={CHANNEL_HEX[c]} radius={[4, 4, 0, 0]} fillOpacity={0.75} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
