/**
 * Logging utility for HUJI Degree Tracker.
 * Handles event logging and mouse movement tracking.
 */

console.log("[LOG:LOGGER_LOADED]");

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
  logType: 'event';
  timestamp: string;
  sessionId: string;
  userId: string;
  pagePath: string;
  eventType: EventType;
  submittedData?: unknown;
  appResult?: unknown;
  status: 'success' | 'failure' | 'error';
  errorMessage?: string;
}

export interface MouseLogPayload {
  logType: 'mouse';
  timestamp: string;
  sessionId: string;
  userId: string;
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
 * Logs an event to the backend API proxy.
 */
export const logEvent = async (
  eventType: EventType, 
  submittedData?: unknown, 
  appResult?: unknown, 
  status: 'success' | 'failure' | 'error' = 'success',
  errorMessage?: string
) => {
  const payload: LogPayload = {
    logType: 'event',
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
    eventType,
    submittedData: submittedData || {},
    appResult: appResult || {},
    status,
    errorMessage: errorMessage || ''
  };

  console.log("[LOG:SENDING]", payload);

  try {
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log("[LOG:SENT:SUCCESS]");
    } else {
      console.error("[LOG:WEBHOOK_FAILED]", result.error);
    }
  } catch (error) {
    console.error("[LOG:API_ROUTE_FAILED]", error);
  }
};

/**
 * Logs mouse movement to the backend API proxy.
 */
export const logMouseMovement = async (data: { x: number, y: number, viewportWidth: number, viewportHeight: number }) => {
  const payload: MouseLogPayload = {
    logType: 'mouse',
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
    ...data
  };

  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // We don't log every mouse movement to console to avoid clutter
  } catch (error) {
    // Fail silently for mouse movements
  }
};
