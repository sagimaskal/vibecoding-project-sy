"use client";

import { useEffect } from 'react';
import { logEvent } from '@/lib/logger';
import { MouseMovementLogger } from './MouseMovementLogger';
import { usePathname } from 'next/navigation';

export function GlobalLogger() {
  const pathname = usePathname();

  useEffect(() => {
    logEvent('app_opened', { pathname });
  }, [pathname]);

  return <MouseMovementLogger />;
}
