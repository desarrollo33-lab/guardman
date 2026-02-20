/**
 * Convex Data Provider for Refine - FULL IMPLEMENTATION
 *
 * PURPOSE: Full CRUD operations between Refine's DataProvider interface
 * and Convex backend for Guardman admin.
 */

import { ConvexReactClient } from 'convex/react';
import type { DataProvider } from '@refinedev/core';

// Use 'any' to avoid complex generic type matching with Refine
// This works correctly at runtime - Refine handles the type inference
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

/**
 * Resource mapping configuration
 */
interface ResourceConfig {
  listQuery: string;
  getQuery: string;
  createMutation?: string;
  updateMutation?: string;
  deleteMutation?: string;
  tableName: string;
  slugField?: string;
  /** Custom ID argument name for mutations (default: 'id') */
  idArg?: string;
}

/**
 * Sorting parameters
 */
interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Filtering parameters
 */
interface FilterParams {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startswith' | 'endswith';
  value: Any;
}

// ============================================================================
// RESOURCE MAPPING - All 19+ Convex tables
// ============================================================================

const RESOURCE_MAP: Record<string, ResourceConfig> = {
  // Core business resources
  services: {
    listQuery: 'services:getAllServices',
    getQuery: 'services:getServiceById',
    createMutation: 'services:createService',
    updateMutation: 'services:updateService',
    deleteMutation: 'services:deleteService',
    tableName: 'services',
    slugField: 'slug',
  },
  solutions: {
    listQuery: 'solutions:getAllSolutions',
    getQuery: 'solutions:getSolutionById',
    createMutation: 'solutions:createSolution',
    updateMutation: 'solutions:updateSolution',
    deleteMutation: 'solutions:deleteSolution',
    tableName: 'solutions',
    slugField: 'slug',
  },
  leads: {
    listQuery: 'leads:getLeads',
    getQuery: 'leads:getLeadById',
    createMutation: 'leads:createLead',
    updateMutation: 'leads:updateLeadStatus',
    tableName: 'leads',
    idArg: 'leadId', // updateLeadStatus expects leadId, not id
  },
  communes: {
    listQuery: 'locations:getAllCommunes',
    getQuery: 'locations:getCommuneById',
    tableName: 'communes',
    slugField: 'slug',
  },
  
  // Content resources
  blog_posts: {
    listQuery: 'blog_posts:getAllPosts',
    getQuery: 'blog_posts:getPostById',
    createMutation: 'blog_posts:createPost',
    updateMutation: 'blog_posts:updatePost',
    deleteMutation: 'blog_posts:deletePost',
    tableName: 'blog_posts',
    slugField: 'slug',
  },
  heroes: {
    listQuery: 'heroes:getAllHeroes',
    getQuery: 'heroes:getHeroById',
    createMutation: 'heroes:createHero',
    updateMutation: 'heroes:updateHero',
    deleteMutation: 'heroes:deleteHero',
    tableName: 'heroes',
  },
  faqs: {
    listQuery: 'faqs:getAllFaqs',
    getQuery: 'faqs:getFaqById',
    createMutation: 'faqs:createFaq',
    updateMutation: 'faqs:updateFaq',
    deleteMutation: 'faqs:deleteFaq',
    tableName: 'faqs',
  },
  testimonials: {
    listQuery: 'testimonials:getAll',
    getQuery: 'testimonials:getTestimonialById',
    createMutation: 'testimonials:createTestimonial',
    updateMutation: 'testimonials:updateTestimonial',
    deleteMutation: 'testimonials:deleteTestimonial',
    tableName: 'testimonials',
  },
  partners: {
    listQuery: 'partners:getAll',
    getQuery: 'partners:getPartnerById',
    createMutation: 'partners:createPartner',
    updateMutation: 'partners:updatePartner',
    deleteMutation: 'partners:deletePartner',
    tableName: 'partners',
  },
  industries: {
    listQuery: 'industries:getAllIndustries',
    getQuery: 'industries:getIndustryById',
    createMutation: 'industries:createIndustry',
    updateMutation: 'industries:updateIndustry',
    deleteMutation: 'industries:deleteIndustry',
    tableName: 'industries',
    slugField: 'slug',
  },
  
  // Site management
  ctas: {
    listQuery: 'ctas:getAllCtas',
    getQuery: 'ctas:getCtaById',
    createMutation: 'ctas:createCta',
    updateMutation: 'ctas:updateCta',
    deleteMutation: 'ctas:deleteCta',
    tableName: 'ctas',
  },
  stats: {
    listQuery: 'stats:getAllStats',
    getQuery: 'stats:getStatById',
    createMutation: 'stats:createStat',
    updateMutation: 'stats:updateStat',
    deleteMutation: 'stats:deleteStat',
    tableName: 'stats',
  },
  process_steps: {
    listQuery: 'process_steps:getAllProcessSteps',
    getQuery: 'process_steps:getProcessStepById',
    createMutation: 'process_steps:createProcessStep',
    updateMutation: 'process_steps:updateProcessStep',
    deleteMutation: 'process_steps:deleteProcessStep',
    tableName: 'process_steps',
  },
  team_members: {
    listQuery: 'team_members:getAllTeamMembers',
    getQuery: 'team_members:getTeamMemberById',
    createMutation: 'team_members:createTeamMember',
    updateMutation: 'team_members:updateTeamMember',
    deleteMutation: 'team_members:deleteTeamMember',
    tableName: 'team_members',
  },
  company_values: {
    listQuery: 'company_values:getAllCompanyValues',
    getQuery: 'company_values:getCompanyValueById',
    createMutation: 'company_values:createCompanyValue',
    updateMutation: 'company_values:updateCompanyValue',
    deleteMutation: 'company_values:deleteCompanyValue',
    tableName: 'company_values',
  },
  authors: {
    listQuery: 'authors:getAllAuthors',
    getQuery: 'authors:getAuthorById',
    createMutation: 'authors:createAuthor',
    updateMutation: 'authors:updateAuthor',
    deleteMutation: 'authors:deleteAuthor',
    tableName: 'authors',
    slugField: 'slug',
  },
  
  // Pages & Content (read-only for now)
  pages: {
    listQuery: 'pages:getAll',
    getQuery: 'pages:getPageById',
    tableName: 'pages',
    slugField: 'slug',
  },
  content_blocks: {
    listQuery: 'content_blocks:getAll',
    getQuery: 'content_blocks:getContentBlockById',
    tableName: 'content_blocks',
  },
  
  // Special resources
  site_config: {
    listQuery: 'site_config:getConfig',
    getQuery: 'site_config:getConfig',
    updateMutation: 'site_config:update',
    tableName: 'site_config',
  },
};

// ============================================================================
// DATA PROVIDER FACTORY
// ============================================================================

/**
 * Creates a Convex Data Provider for Refine
 */
export function createConvexDataProvider(client: ConvexReactClient): DataProvider {
  // --------------------------------------------------------------------------
  // getList - List resources with pagination, sorting, filtering
  // --------------------------------------------------------------------------
  const getList = async (params: Any): Promise<Any> => {
    const { resource, pagination, sorters, filters } = params;
    const resourceConfig = RESOURCE_MAP[resource];

    if (!resourceConfig) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" not found`);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: Any[] = await (client as any).query(resourceConfig.listQuery);

      // Apply filters
      if (filters && filters.length > 0) {
        data = applyFilters(data, filters);
      }

      // Apply sorters
      if (sorters && sorters.length > 0) {
        data = applySorters(data, sorters);
      }

      // Apply pagination
      const total = data.length;
      const { current = 1, pageSize = 10, mode = 'server' } = pagination ?? {};

      if (mode === 'off') {
        return { data, total };
      }

      const start = (current - 1) * pageSize;
      const paginatedData = data.slice(start, start + pageSize);

      return { data: paginatedData, total };
    } catch (error) {
      throw parseError(error, `getList failed for ${resource}`);
    }
  };

  // --------------------------------------------------------------------------
  // getOne - Get single resource by ID
  // --------------------------------------------------------------------------
  const getOne = async (params: Any): Promise<Any> => {
    const { resource, id } = params;
    const resourceConfig = RESOURCE_MAP[resource];

    if (!resourceConfig) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" not found`);
    }

    try {
      const convexId = String(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await (client as any).query(resourceConfig.getQuery, { id: convexId });

      if (!data) {
        throw new Error(`[ConvexDataProvider] ${resource} with id "${id}" not found`);
      }

      return { data };
    } catch (error) {
      throw parseError(error, `getOne failed for ${resource}:${id}`);
    }
  };

  // --------------------------------------------------------------------------
  // create - Create new resource
  // --------------------------------------------------------------------------
  const create = async (params: Any): Promise<Any> => {
    const { resource, variables } = params;
    const resourceConfig = RESOURCE_MAP[resource];

    if (!resourceConfig) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" not found`);
    }

    if (!resourceConfig.createMutation) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" does not support create`);
    }

    try {
      const cleanVariables = Object.fromEntries(
        Object.entries(variables).filter(([_, v]) => v !== undefined)
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (client as any).mutation(resourceConfig.createMutation, cleanVariables);

      // Fetch created record
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const created = await (client as any).query(resourceConfig.getQuery, { id: result });

      return { data: created };
    } catch (error) {
      throw parseError(error, `create failed for ${resource}`);
    }
  };

  // --------------------------------------------------------------------------
  // update - Update existing resource
  // --------------------------------------------------------------------------
  const update = async (params: Any): Promise<Any> => {
    const { resource, id, variables } = params;
    const resourceConfig = RESOURCE_MAP[resource];

    if (!resourceConfig) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" not found`);
    }

    if (!resourceConfig.updateMutation) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" does not support update`);
    }

    try {
      const convexId = String(id);
      const cleanVariables = Object.fromEntries(
        Object.entries(variables).filter(([_, v]) => v !== undefined)
      );

      // Use custom ID argument name if specified (e.g., 'leadId' for leads)
      const idArgName = resourceConfig.idArg ?? 'id';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client as any).mutation(resourceConfig.updateMutation, { [idArgName]: convexId, ...cleanVariables });

      // Fetch updated record
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated = await (client as any).query(resourceConfig.getQuery, { id: convexId });

      return { data: updated };
    } catch (error) {
      throw parseError(error, `update failed for ${resource}:${id}`);
    }
  };

  // --------------------------------------------------------------------------
  // deleteOne - Delete resource
  // --------------------------------------------------------------------------
  const deleteOne = async (params: Any): Promise<Any> => {
    const { resource, id } = params;
    const resourceConfig = RESOURCE_MAP[resource];

    if (!resourceConfig) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" not found`);
    }

    if (!resourceConfig.deleteMutation) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" does not support delete`);
    }

    try {
      const convexId = String(id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (client as any).mutation(resourceConfig.deleteMutation, { id: convexId });

      return { data: { id } };
    } catch (error) {
      throw parseError(error, `deleteOne failed for ${resource}:${id}`);
    }
  };

  // --------------------------------------------------------------------------
  // getMany - Get multiple records by IDs
  // --------------------------------------------------------------------------
  const getMany = async (params: Any): Promise<Any> => {
    const { resource, ids } = params;
    const resourceConfig = RESOURCE_MAP[resource];

    if (!resourceConfig) {
      throw new Error(`[ConvexDataProvider] Resource "${resource}" not found`);
    }

    try {
      const results = await Promise.all(
        (ids as Any[]).map(async (id: Any) => {
          try {
            const convexId = String(id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return await (client as any).query(resourceConfig.getQuery, { id: convexId });
          } catch {
            return null;
          }
        })
      );

      return { data: results.filter(Boolean) };
    } catch (error) {
      throw parseError(error, `getMany failed for ${resource}`);
    }
  };

  // --------------------------------------------------------------------------
  // getApiUrl - Return Convex deployment URL
  // --------------------------------------------------------------------------
  const getApiUrl = (): string => {
    return client.url;
  };

  return {
    getList,
    getOne,
    create,
    update,
    deleteOne,
    getMany,
    getApiUrl,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Apply filters to data array */
function applyFilters(data: Any[], filters: FilterParams[]): Any[] {
  return data.filter((item) => {
    const itemObj = item as Record<string, Any>;
    
    return filters.every((filter) => {
      const value = itemObj[filter.field];
      
      switch (filter.operator) {
        case 'eq': return value === filter.value;
        case 'ne': return value !== filter.value;
        case 'gt': return typeof value === 'number' && value > (filter.value as number);
        case 'gte': return typeof value === 'number' && value >= (filter.value as number);
        case 'lt': return typeof value === 'number' && value < (filter.value as number);
        case 'lte': return typeof value === 'number' && value <= (filter.value as number);
        case 'contains': return typeof value === 'string' && value.includes(filter.value as string);
        case 'startswith': return typeof value === 'string' && value.startsWith(filter.value as string);
        case 'endswith': return typeof value === 'string' && value.endsWith(filter.value as string);
        default: return true;
      }
    });
  });
}

/** Apply sorters to data array */
function applySorters(data: Any[], sorters: SortParams[]): Any[] {
  const sorted = [...data];
  
  sorted.sort((a, b) => {
    const aObj = a as Record<string, Any>;
    const bObj = b as Record<string, Any>;
    
    for (const { field, order } of sorters) {
      const aValue = aObj[field];
      const bValue = bObj[field];
      
      let comparison = 0;
      if (aValue === bValue) continue;
      if (aValue === undefined || aValue === null) comparison = 1;
      else if (bValue === undefined || bValue === null) comparison = -1;
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return order === 'desc' ? -comparison : comparison;
    }
    
    return 0;
  });
  
  return sorted;
}

/** Parse error into Refine-compatible format */
function parseError(error: unknown, context: string): Error {
  if (error instanceof Error) {
    const message = error.message.includes('[ConvexDataProvider]')
      ? error.message
      : `[ConvexDataProvider] ${context}: ${error.message}`;
    return new Error(message);
  }
  return new Error(`[ConvexDataProvider] ${context}: ${String(error)}`);
}

export default createConvexDataProvider;
