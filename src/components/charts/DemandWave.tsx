'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MONTHS } from '@/lib/constants';

interface Props { data: number[]; }

export default function DemandWave({ data }: Props) {
  const chartData = data.map((v, i) => ({ month: MONTHS[i], value: v }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#22d3a5" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22d3a5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[50, 100]} tick={{ fill: '#6868a0', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: 'rgba(13,13,38,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#eaeaf8', fontSize: 12 }} />
        <Area type="monotone" dataKey="value" stroke="#22d3a5" strokeWidth={2} fill="url(#demandGrad)" dot={{ fill: '#22d3a5', r: 3 }} activeDot={{ r: 6 }} name="Demand Index" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
