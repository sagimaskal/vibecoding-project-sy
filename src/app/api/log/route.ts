import { NextRequest, NextResponse } from 'next/server';

import { google } from 'googleapis';

/**
 * API route for receiving logs and sending them to Google Sheets or Console.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // 1. Log to console for development and fallback
    console.log(`[LOG:${type.toUpperCase()}]`, JSON.stringify(data, null, 2));

    // 2. Google Sheets Integration
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

    if (spreadsheetId && clientEmail && privateKey) {
      try {
        const auth = new google.auth.JWT(
          clientEmail,
          undefined,
          privateKey.replace(/\\n/g, '\n'),
          ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });
        const sheetName = type === 'event' ? 'event_logs' : 'mouse_logs';
        
        const values = type === 'event' ? [
          data.timestamp,
          data.sessionId,
          data.userId,
          data.pagePath,
          data.eventType,
          JSON.stringify(data.submittedData || {}),
          JSON.stringify(data.appResult || {}),
          data.status,
          data.errorMessage || ''
        ] : [
          data.timestamp,
          data.sessionId,
          data.userId,
          data.pagePath,
          data.x,
          data.y,
          data.viewportWidth,
          data.viewportHeight
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${sheetName}!A:Z`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [values],
          },
        });
      } catch (err) {
        console.error('Error appending to Google Sheets:', err);
        // Backup console log already happened, so we just log the failure here
      }
    } else {
      // Optional: log that sheets integration is skipped due to missing env vars
      // console.log('Google Sheets integration skipped: Missing environment variables');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logging API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
