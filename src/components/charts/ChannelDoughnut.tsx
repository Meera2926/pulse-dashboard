'use client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CHANNELS, CHANNEL_HEX } from '@/lib/constants';
import type { Channel } from '@/lib/constants';

interface Props { hits: Record<Channel, number>; }

export default function ChannelDoughnut({ hits }: Props) {
  const data = CHANNELS.map(c => ({ name: c, value: hits[c] ?? 0 }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius="55%" outerRadius="75%" paddingAngle={3} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={CHANNEL_HEX[entry.name as Channel]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: 'rgba(13,13,38,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#eaeaf8', fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6868a0' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
