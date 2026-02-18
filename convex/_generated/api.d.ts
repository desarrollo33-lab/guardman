/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _test_utils from "../_test/utils.js";
import type * as auth from "../auth.js";
import type * as authors from "../authors.js";
import type * as blog_posts from "../blog_posts.js";
import type * as communes from "../communes.js";
import type * as company_values from "../company_values.js";
import type * as content_blocks from "../content_blocks.js";
import type * as ctas from "../ctas.js";
import type * as debug_pages from "../debug_pages.js";
import type * as faqs from "../faqs.js";
import type * as heroes from "../heroes.js";
import type * as industries from "../industries.js";
import type * as leads from "../leads.js";
import type * as locations from "../locations.js";
import type * as pages from "../pages.js";
import type * as partners from "../partners.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as site_config from "../site_config.js";
import type * as solutions from "../solutions.js";
import type * as stats from "../stats.js";
import type * as storage from "../storage.js";
import type * as team_members from "../team_members.js";
import type * as testimonials from "../testimonials.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_test/utils": typeof _test_utils;
  auth: typeof auth;
  authors: typeof authors;
  blog_posts: typeof blog_posts;
  communes: typeof communes;
  company_values: typeof company_values;
  content_blocks: typeof content_blocks;
  ctas: typeof ctas;
  debug_pages: typeof debug_pages;
  faqs: typeof faqs;
  heroes: typeof heroes;
  industries: typeof industries;
  leads: typeof leads;
  locations: typeof locations;
  pages: typeof pages;
  partners: typeof partners;
  seed: typeof seed;
  services: typeof services;
  site_config: typeof site_config;
  solutions: typeof solutions;
  stats: typeof stats;
  storage: typeof storage;
  team_members: typeof team_members;
  testimonials: typeof testimonials;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
