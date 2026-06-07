import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for receiving logs and forwarding them to Google Apps Script.
 * Acting as a proxy to avoid CORS issues and hide the webhook URL.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { logType } = body;

    // Validate log type
    if (logType !== 'event' && logType !== 'mouse') {
      return NextResponse.json({ success: false, error: 'Invalid log type' }, { status: 400 });
    }

    // 1. Log to server-side console (Vercel)
    console.log(`[LOG:${logType.toUpperCase()}]`, JSON.stringify(body, null, 2));

    // 2. Forward to Google Apps Script
    const webhookUrl = process.env.LOGGING_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn("[LOG:SERVER] LOGGING_WEBHOOK_URL is missing in environment variables.");
      return NextResponse.json({ success: false, error: 'Server configuration error: missing webhook URL' });
    }

    try {
      // Forward exactly what we received
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const appsScriptText = await response.text();
      
      if (response.ok) {
        return NextResponse.json({ 
          success: true, 
          appsScriptResponse: appsScriptText 
        });
      } else {
        console.error(`[LOG:SERVER] Apps Script error: ${response.status}`, appsScriptText);
        return NextResponse.json({ 
          success: false, 
          error: `Apps Script error: ${response.status}`,
          details: appsScriptText
        });
      }
    } catch (err) {
      console.error('[LOG:SERVER] Failed to fetch Apps Script:', err);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to connect to Google Apps Script',
        details: err instanceof Error ? err.message : String(err)
      });
    }
  } catch (error) {
    console.error('[LOG:SERVER] API route error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
