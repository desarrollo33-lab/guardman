import { internalMutation } from './_generated/server';

/**
 * Migration: Remove legacy fields from industries table
 * 
 * Removes these fields that were marked as legacy:
 * - id
 * - challenges
 * - meta_title
 * - meta_description
 * - relatedServices
 * - solutions
 * 
 * Run with: npx convex run migrations:removeIndustriesLegacyFields
 */
export const removeIndustriesLegacyFields = internalMutation({
  handler: async (ctx) => {
    const industries = await ctx.db.query('industries').collect();
    
    let migrated = 0;
    for (const industry of industries) {
      // Cast to handle legacy fields that exist in DB but not in generated types
      const doc = industry as Record<string, unknown>;
      const legacyFields: Record<string, undefined> = {};
      let hasLegacyFields = false;
      
      // Check and mark each legacy field for removal
      if ('id' in doc && doc.id !== undefined) {
        legacyFields.id = undefined;
        hasLegacyFields = true;
      }
      if ('challenges' in doc && doc.challenges !== undefined) {
        legacyFields.challenges = undefined;
        hasLegacyFields = true;
      }
      if ('meta_title' in doc && doc.meta_title !== undefined) {
        legacyFields.meta_title = undefined;
        hasLegacyFields = true;
      }
      if ('meta_description' in doc && doc.meta_description !== undefined) {
        legacyFields.meta_description = undefined;
        hasLegacyFields = true;
      }
      if ('relatedServices' in doc && doc.relatedServices !== undefined) {
        legacyFields.relatedServices = undefined;
        hasLegacyFields = true;
      }
      if ('solutions' in doc && doc.solutions !== undefined) {
        legacyFields.solutions = undefined;
        hasLegacyFields = true;
      }
      
      if (hasLegacyFields) {
        await ctx.db.patch(industry._id, legacyFields);
        migrated++;
      }
    }
    
    return { migrated, total: industries.length };
  },
});

/**
 * Migration: Remove legacy fields from solutions table
 * 
 * Removes: name (replaced by title)
 * 
 * Run with: npx convex run migrations:removeSolutionsLegacyFields
 */
export const removeSolutionsLegacyFields = internalMutation({
  handler: async (ctx) => {
    const solutions = await ctx.db.query('solutions').collect();
    
    let migrated = 0;
    for (const solution of solutions) {
      const doc = solution as Record<string, unknown>;
      if ('name' in doc && doc.name !== undefined) {
        const updates: Record<string, undefined> = { name: undefined };
        await ctx.db.patch(solution._id, updates);
        migrated++;
      }
    }
    
    return { migrated, total: solutions.length };
  },
});

/**
 * Migration: Remove legacy fields from site_config table
 * 
 * Removes: 
 * - navbar_items[].path (replaced by href)
 * - footer_config
 * 
 * Run with: npx convex run migrations:removeSiteConfigLegacyFields
 */
export const removeSiteConfigLegacyFields = internalMutation({
  handler: async (ctx) => {
    const configs = await ctx.db.query('site_config').collect();
    
    let migrated = 0;
    for (const config of configs) {
      const doc = config as Record<string, unknown>;
      let needsUpdate = false;
      const updates: Record<string, unknown> = {};
      
      // Remove footer_config if present
      if ('footer_config' in doc && doc.footer_config !== undefined) {
        updates.footer_config = undefined;
        needsUpdate = true;
      }
      
      // Remove path from navbar_items if present
      const navbarItems = config.navbar_items as Array<Record<string, unknown>>;
      if (navbarItems?.some((item) => 'path' in item && item.path !== undefined)) {
        updates.navbar_items = navbarItems.map((item) => {
          const { path: _path, ...rest } = item;
          return rest;
        });
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await ctx.db.patch(config._id, updates);
        migrated++;
      }
    }
    
    return { migrated, total: configs.length };
  },
});

/**
 * Run all Wave 1 migrations in sequence
 * 
 * Run with: npx convex run migrations:runWave1
 */
export const runWave1 = internalMutation({
  handler: async (ctx) => {
    // Migrate industries
    const industries = await ctx.db.query('industries').collect();
    let industriesMigrated = 0;
    for (const industry of industries) {
      const doc = industry as Record<string, unknown>;
      const legacyFields: Record<string, undefined> = {};
      let hasLegacyFields = false;
      
      if ('id' in doc && doc.id !== undefined) { legacyFields.id = undefined; hasLegacyFields = true; }
      if ('challenges' in doc && doc.challenges !== undefined) { legacyFields.challenges = undefined; hasLegacyFields = true; }
      if ('meta_title' in doc && doc.meta_title !== undefined) { legacyFields.meta_title = undefined; hasLegacyFields = true; }
      if ('meta_description' in doc && doc.meta_description !== undefined) { legacyFields.meta_description = undefined; hasLegacyFields = true; }
      if ('relatedServices' in doc && doc.relatedServices !== undefined) { legacyFields.relatedServices = undefined; hasLegacyFields = true; }
      if ('solutions' in doc && doc.solutions !== undefined) { legacyFields.solutions = undefined; hasLegacyFields = true; }
      
      if (hasLegacyFields) {
        await ctx.db.patch(industry._id, legacyFields);
        industriesMigrated++;
      }
    }
    
    // Migrate solutions
    const solutions = await ctx.db.query('solutions').collect();
    let solutionsMigrated = 0;
    for (const solution of solutions) {
      const doc = solution as Record<string, unknown>;
      if ('name' in doc && doc.name !== undefined) {
        const updates: Record<string, undefined> = { name: undefined };
        await ctx.db.patch(solution._id, updates);
        solutionsMigrated++;
      }
    }
    
    // Migrate site_config
    const configs = await ctx.db.query('site_config').collect();
    let siteConfigMigrated = 0;
    for (const config of configs) {
      const doc = config as Record<string, unknown>;
      let needsUpdate = false;
      const updates: Record<string, unknown> = {};
      
      if ('footer_config' in doc && doc.footer_config !== undefined) {
        updates.footer_config = undefined;
        needsUpdate = true;
      }
      
      const navbarItems = config.navbar_items as Array<Record<string, unknown>>;
      if (navbarItems?.some((item) => 'path' in item && item.path !== undefined)) {
        updates.navbar_items = navbarItems.map((item) => {
          const { path: _path, ...rest } = item;
          return rest;
        });
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await ctx.db.patch(config._id, updates);
        siteConfigMigrated++;
      }
    }
    
    return {
      industries: { migrated: industriesMigrated, total: industries.length },
      solutions: { migrated: solutionsMigrated, total: solutions.length },
      site_config: { migrated: siteConfigMigrated, total: configs.length },
    };
  },
});
