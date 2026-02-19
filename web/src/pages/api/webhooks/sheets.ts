import type { APIRoute } from 'astro';

const GOOGLE_SCRIPT_URL = import.meta.env.GOOGLE_SCRIPT_URL || '';

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  source?: string;
  [key: string]: unknown;
}

// Health check endpoint
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      endpoint: '/api/webhooks/sheets',
      configured: !!GOOGLE_SCRIPT_URL,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if Google Script URL is configured
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('[sheets webhook] GOOGLE_SCRIPT_URL not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Webhook not configured',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse incoming lead data
    let leadData: LeadData;
    try {
      leadData = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON body',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...leadData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(
        `[sheets webhook] Google Script returned ${response.status}: ${response.statusText}`
      );
      // Don't fail the request - webhook failures should be non-blocking
      return new Response(
        JSON.stringify({
          success: false,
          warning: 'Google Script request failed',
          status: response.status,
        }),
        {
          status: 200, // Return 200 so caller doesn't retry unnecessarily
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead forwarded to Google Sheets',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[sheets webhook] Unexpected error:', error);
    // Return 200 with error info - don't block the main flow
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal webhook error',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
