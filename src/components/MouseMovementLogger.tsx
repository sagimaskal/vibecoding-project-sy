"use client";

import { useEffect, useRef } from 'react';
import { logMouseMovement } from '@/lib/logger';

export function MouseMovementLogger() {
  const lastLogTime = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle to 500ms
      if (now - lastLogTime.current >= 500) {
        lastLogTime.current = now;
        
        logMouseMovement({
          x: e.clientX,
          y: e.clientY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null; // This component doesn't render anything
}
