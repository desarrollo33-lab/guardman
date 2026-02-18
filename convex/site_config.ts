import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import type { Id } from './_generated/dataModel';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('site_config')
      .withIndex('by_active', (q) => q.eq('is_active', true))
      .first();
  },
});

export const update = mutation({
  args: {
    id: v.optional(v.id('site_config')),
    brand_name: v.string(),
    phone_primary: v.string(),
    phone_secondary: v.optional(v.string()),
    whatsapp_number: v.string(),
    email_contact: v.string(),
    address_main: v.optional(v.string()),
    social_links: v.object({
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      facebook: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    navbar_items: v.array(
      v.object({
        label: v.string(),
        href: v.string(),
        is_button: v.optional(v.boolean()),
        children: v.optional(
          v.array(
            v.object({
              label: v.string(),
              href: v.string(),
            })
          )
        ),
      })
    ),
  },
  returns: v.id('site_config'),
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    if (id) {
      // Update existing config
      await ctx.db.patch(id, {
        brand_name: data.brand_name,
        phone_primary: data.phone_primary,
        phone_secondary: data.phone_secondary,
        whatsapp_number: data.whatsapp_number,
        email_contact: data.email_contact,
        address_main: data.address_main,
        social_links: data.social_links,
        navbar_items: data.navbar_items,
      });
      return id;
    } else {
      // Create new config (deactivate others first)
      const existingConfigs = await ctx.db
        .query('site_config')
        .withIndex('by_active', (q) => q.eq('is_active', true))
        .collect();

      for (const config of existingConfigs) {
        await ctx.db.patch(config._id, { is_active: false });
      }

      // Insert new active config
      return await ctx.db.insert('site_config', {
        is_active: true,
        brand_name: data.brand_name,
        phone_primary: data.phone_primary,
        phone_secondary: data.phone_secondary,
        whatsapp_number: data.whatsapp_number,
        email_contact: data.email_contact,
        address_main: data.address_main,
        social_links: data.social_links,
        navbar_items: data.navbar_items,
      });
    }
  },
});
