/**
 * Logging utility for HUJI Degree Tracker.
 * Handles event logging and mouse movement tracking.
 */

console.log("[LOG:LOGGER_LOADED]");
console.log("[LOG:WEBHOOK_URL_EXISTS]", Boolean(process.env.NEXT_PUBLIC_LOGGING_WEBHOOK_URL));

export type EventType = 
  | 'app_opened'
  | 'dashboard_viewed'
  | 'course_added'
  | 'course_edited'
  | 'course_deleted'
  | 'grade_changed'
  | 'weighted_average_calculated'
  | 'progress_overview_calculated'
  | 'validation_error'
  | 'data_reset'
  | 'login'
  | 'signup';

export interface LogPayload {
  timestamp: string;
  sessionId: string;
  userId?: string;
  pagePath: string;
  eventType: EventType;
  submittedData?: unknown;
  appResult?: unknown;
  status: 'success' | 'failure' | 'error';
  errorMessage?: string;
}

export interface MouseLogPayload {
  timestamp: string;
  sessionId: string;
  userId?: string;
  pagePath: string;
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Gets or creates a session ID stored in sessionStorage.
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-side';
  
  let sessionId = sessionStorage.getItem('huji_tracker_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem('huji_tracker_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Gets the user identifier (hash of email if available).
 */
const getUserId = (): string => {
  if (typeof window === 'undefined') return 'anonymous';
  const email = localStorage.getItem('huji_user_email');
  if (!email) return 'anonymous';
  
  // Simple "hash" for userId privacy
  return btoa(email).substring(0, 10);
};

/**
 * Logs an event to the backend and Apps Script Webhook.
 */
export const logEvent = async (
  eventType: EventType, 
  submittedData?: unknown, 
  appResult?: unknown, 
  status: 'success' | 'failure' | 'error' = 'success',
  errorMessage?: string
) => {
  const payload: LogPayload = {
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
    eventType,
    submittedData,
    appResult,
    status,
    errorMessage
  };

  // 1. Console Fallback
  console.log(`[LOG:EVENT:${eventType.toUpperCase()}]`, payload);
  console.log("[LOG:SENDING]", payload);

  // 2. Local Backend Log (for Vercel logs)
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'event', data: payload }),
    });
  } catch (e) {
    // Ignore backend errors
  }

  // 3. Direct Apps Script Webhook
  const webhookUrl = process.env.NEXT_PUBLIC_LOGGING_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[LOG:MISSING_WEBHOOK_URL]");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ type: 'event', data: payload }),
    });
    console.log("[LOG:SENT:SUCCESS]");
  } catch (error) {
    console.error("[LOG:WEBHOOK_FAILED]", error);
  }
};

/**
 * Logs mouse movement to the backend and Apps Script Webhook.
 */
export const logMouseMovement = async (data: { x: number, y: number, viewportWidth: number, viewportHeight: number }) => {
  const payload: MouseLogPayload = {
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
    ...data
  };

  // 1. Console Fallback
  // console.log("[LOG:MOUSE]", payload); // Keep mouse logs commented out by default to avoid noise, but can be enabled for debug

  // 3. Direct Apps Script Webhook
  const webhookUrl = process.env.NEXT_PUBLIC_LOGGING_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ type: 'mouse', data: payload }),
    });
    // For mouse, we don't log success every 500ms to avoid flooding
  } catch (error) {
    // Fail silently for mouse movements
  }
};
