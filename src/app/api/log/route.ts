import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for receiving logs and forwarding them to Google Apps Script.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // 1. Log to console for development and fallback
    console.log(`[LOG:${type.toUpperCase()}]`, JSON.stringify(data, null, 2));

    // 2. Google Apps Script Webhook Integration
    const webhookUrl = process.env.NEXT_PUBLIC_LOGGING_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        // Forward the log to the Google Apps Script Web App
        // We don't await this if we want to return the response to the client faster,
        // but since we want to handle failures/logging, we await it here.
        const response = await fetch(webhookUrl, {
          method: 'POST',
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          console.error(`Apps Script Webhook returned status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error forwarding to Apps Script Webhook:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logging API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
