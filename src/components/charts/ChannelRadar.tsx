'use client';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { CHANNELS } from '@/lib/constants';
import type { Channel } from '@/lib/constants';

interface Props { hits: Record<Channel, number>; }

const CONVERSION_BASE: Record<Channel, number> = {
  Email: 65,
  Social: 52,
  Ads: 48,
  Referral: 82,
  Organic: 60,
  SMS: 70,
};

export default function ChannelRadar({ hits }: Props) {
  const total = Object.values(hits).reduce((a, b) => a + b, 1);
  const data = CHANNELS.map(c => ({
    channel: c,
    reach: Math.min(100, Math.round(((hits[c] || 10) / total) * 600)),
    conversion: CONVERSION_BASE[c] || 50,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis dataKey="channel" tick={{ fill: '#6868a0', fontSize: 11 }} />
        <Radar name="Reach" dataKey="reach" stroke="#4f8eff" fill="#4f8eff" fillOpacity={0.12} strokeWidth={2} dot={{ fill: '#4f8eff', r: 3 }} />
        <Radar name="Conversions" dataKey="conversion" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={2} dot={{ fill: '#a855f7', r: 3 }} />
        <Tooltip contentStyle={{ background: 'rgba(13,13,38,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#eaeaf8', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#6868a0' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
