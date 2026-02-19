import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';

// Initialize Convex client for server-side use
const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;
const convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.nombre || !body.telefono || !body.servicio) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Faltan campos requeridos: nombre, telefono, servicio',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Ensure Convex client is available
    if (!convexClient) {
      console.error(
        'Convex client not initialized - missing PUBLIC_CONVEX_URL'
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Error de configuración del servidor',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Save lead to Convex
    const leadId = await convexClient.mutation(api.leads.createLead, {
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email || undefined,
      servicio: body.servicio,
      ciudad: body.ciudad || undefined,
      mensaje: body.mensaje || undefined,
      source: body.source || undefined,
      utm_source: body.utm_source || undefined,
      utm_medium: body.utm_medium || undefined,
      utm_campaign: body.utm_campaign || undefined,
    });

    // Log the lead for development (after successful save)
    console.log('📊 New Lead Saved:', {
      id: leadId,
      timestamp: new Date().toISOString(),
      ...body,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead recibido correctamente',
        leadId: leadId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al procesar la solicitud',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
