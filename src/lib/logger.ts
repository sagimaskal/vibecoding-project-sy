/**
 * Logging utility for HUJI Degree Tracker.
 * Handles event logging and mouse movement tracking via Supabase.
 */

import { supabase } from './supabase';

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
 * Logs an event to Supabase.
 */
export const logEvent = async (
  eventType: EventType, 
  submittedData?: unknown, 
  appResult?: unknown, 
  status: 'success' | 'failure' | 'error' = 'success',
  errorMessage?: string
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("[LOG:SKIP] No active session for logging", eventType);
      return;
    }

    const payload = {
      user_id: session.user.id,
      session_id: getSessionId(),
      event_type: eventType,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      submitted_data: submittedData || {},
      app_result: appResult || {},
      status,
      error_message: errorMessage || ''
    };

    console.log("[LOG:SENDING:SUPABASE]", eventType);

    const { error } = await supabase
      .from('event_logs')
      .insert(payload);

    if (error) {
      console.error("[LOG:SUPABASE_ERROR]", error);
    }
  } catch (error) {
    console.error("[LOG:API_FAILED]", error);
  }
};

/**
 * Logs mouse movement to Supabase.
 */
export const logMouseMovement = async (data: { x: number, y: number, viewportWidth: number, viewportHeight: number }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const payload = {
      user_id: session.user.id,
      session_id: getSessionId(),
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      x: data.x,
      y: data.y,
      viewport_width: data.viewportWidth,
      viewport_height: data.viewportHeight
    };

    // Fail silently for mouse movements to avoid UI lag
    supabase.from('mouse_logs').insert(payload).then(({ error }) => {
      if (error) console.warn("[LOG:MOUSE:ERROR]", error.message);
    });
  } catch (error) {
    // Fail silently
  }
};
