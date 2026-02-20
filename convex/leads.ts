import { mutation, query, action } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

// Internal action: Trigger webhook to notify about new lead
export const triggerWebhook = action({
  args: {
    leadData: v.object({
      nombre: v.string(),
      telefono: v.string(),
      email: v.optional(v.string()),
      servicio: v.string(),
      ciudad: v.optional(v.string()),
      mensaje: v.optional(v.string()),
      source: v.optional(v.string()),
      utm_source: v.optional(v.string()),
      utm_medium: v.optional(v.string()),
      utm_campaign: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Webhook URL - configured via environment variable
    const webhookUrl = process.env.WEBHOOK_URL;

    // If WEBHOOK_URL is not configured, skip webhook silently
    if (!webhookUrl) {
      console.log('WEBHOOK_URL not configured, skipping webhook');
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.leadData),
      });
      // Success - webhook triggered
    } catch (error) {
      // Log error but don't throw - webhook failure should not block anything
      console.error('Webhook trigger failed:', error);
    }
  },
});

// Mutation: Create a new lead
export const createLead = mutation({
  args: {
    nombre: v.string(),
    telefono: v.string(),
    email: v.optional(v.string()),
    servicio: v.string(),
    ciudad: v.optional(v.string()),
    mensaje: v.optional(v.string()),
    source: v.optional(v.string()),
    utm_source: v.optional(v.string()),
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert('leads', {
      ...args,
      status: 'new',
      createdAt: Date.now(),
    });

    // Trigger webhook asynchronously after lead is saved
    // Using scheduler.runAfter ensures the webhook call doesn't block the response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ctx.scheduler.runAfter(0, (internal as any).leads.triggerWebhook, {
      leadData: args,
    });

    return leadId;
  },
});

// Query: Get leads with pagination
export const getLeads = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const leads = await ctx.db
      .query('leads')
      .order('desc')
      .paginate({
        cursor: args.cursor ?? null,
        numItems: limit,
      });

    return leads;
  },
});

// Query: Get leads by status
export const getLeadsByStatus = query({
  args: {
    status: v.string(),
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const leads = await ctx.db
      .query('leads')
      .withIndex('by_status', (q) => q.eq('status', args.status))
      .order('desc')
      .paginate({
        cursor: args.cursor ?? null,
        numItems: limit,
      });

    return leads;
  },
});

// Mutation: Update lead status
export const updateLeadStatus = mutation({
  args: {
    leadId: v.id('leads'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      status: args.status,
    });
    return true;
  },
});

// Query: Get lead by ID
export const getLeadById = query({
  args: {
    id: v.id('leads'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query: Get leads count by status
export const getLeadsCount = query({
  handler: async (ctx) => {
    const leads = await ctx.db.query('leads').collect();

    const counts = {
      total: leads.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };

    for (const lead of leads) {
      const status = lead.status ?? 'new';
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    }

    return counts;
  },
});
