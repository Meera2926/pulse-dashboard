'use client';
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

/** Starts the live event simulation loop. Mount once in the dashboard layout. */
export function useLiveSimulation() {
  const { tick, isSimulating, simulationSpeed } = useAppStore();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // Seed initial batch of events on first mount
      for (let i = 0; i < 8; i++) {
        setTimeout(() => tick(), i * 150);
      }
    }
  }, [tick]);

  useEffect(() => {
    if (!isSimulating) return;

    let timeout: ReturnType<typeof setTimeout>;
    function schedule() {
      // Add slight jitter around chosen simulation speed
      const delay = Math.max(400, simulationSpeed + (Math.random() - 0.5) * (simulationSpeed * 0.4));
      timeout = setTimeout(() => {
        tick();
        schedule();
      }, delay);
    }

    schedule();
    return () => clearTimeout(timeout);
  }, [isSimulating, simulationSpeed, tick]);
}
