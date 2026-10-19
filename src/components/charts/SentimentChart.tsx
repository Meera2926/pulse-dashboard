'use client';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const DATA = [
  { name: 'Positive', value: 68, color: '#22d3a5' },
  { name: 'Neutral',  value: 22, color: '#4f8eff' },
  { name: 'Negative', value: 10, color: '#fb923c' },
];

export default function SentimentChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={DATA} cx="50%" cy="45%" innerRadius="50%" outerRadius="70%" paddingAngle={4} dataKey="value">
          {DATA.map((entry) => <Cell key={entry.name} fill={entry.color} stroke="transparent" />)}
        </Pie>
        <Tooltip contentStyle={{ background: 'rgba(13,13,38,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#eaeaf8', fontSize: 12 }} formatter={(v) => [`${v}%`]} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6868a0' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
