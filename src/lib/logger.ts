/**
 * Logging utility for HUJI Degree Tracker.
 * Handles event logging and mouse movement tracking.
 */

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
 * Logs an event to the backend.
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

  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'event', data: payload }),
    });
  } catch (error) {
    console.error('Failed to log event:', error);
  }
};

/**
 * Logs mouse movement to the backend.
 */
export const logMouseMovement = async (data: { x: number, y: number, viewportWidth: number, viewportHeight: number }) => {
  const payload: MouseLogPayload = {
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId: getUserId(),
    pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
    ...data
  };

  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'mouse', data: payload }),
    });
  } catch (error) {
    // Fail silently for mouse movements to avoid spamming console
  }
};
