'use client';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import ParticleBackground from '@/components/layout/ParticleBackground';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import LiveTicker from '@/components/layout/LiveTicker';

function SimulationStarter() {
  useLiveSimulation();
  return null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg,#07071a 0%,#0d0d26 100%)' }}>
      <ParticleBackground />
      <SimulationStarter />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          {children}
        </main>
        <LiveTicker />
      </div>
    </div>
  );
}
