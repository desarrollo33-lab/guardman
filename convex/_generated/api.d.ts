/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_utils from "../admin_utils.js";
import type * as auth from "../auth.js";
import type * as authors from "../authors.js";
import type * as blog_posts from "../blog_posts.js";
import type * as career_benefits from "../career_benefits.js";
import type * as careers from "../careers.js";
import type * as company_values from "../company_values.js";
import type * as content_blocks from "../content_blocks.js";
import type * as ctas from "../ctas.js";
import type * as faqs from "../faqs.js";
import type * as heroes from "../heroes.js";
import type * as industries from "../industries.js";
import type * as leads from "../leads.js";
import type * as locations from "../locations.js";
import type * as migrations from "../migrations.js";
import type * as pages from "../pages.js";
import type * as partners from "../partners.js";
import type * as process_steps from "../process_steps.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as service_locations from "../service_locations.js";
import type * as services from "../services.js";
import type * as site_config from "../site_config.js";
import type * as solutions from "../solutions.js";
import type * as stats from "../stats.js";
import type * as storage from "../storage.js";
import type * as team_members from "../team_members.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin_utils: typeof admin_utils;
  auth: typeof auth;
  authors: typeof authors;
  blog_posts: typeof blog_posts;
  career_benefits: typeof career_benefits;
  careers: typeof careers;
  company_values: typeof company_values;
  content_blocks: typeof content_blocks;
  ctas: typeof ctas;
  faqs: typeof faqs;
  heroes: typeof heroes;
  industries: typeof industries;
  leads: typeof leads;
  locations: typeof locations;
  migrations: typeof migrations;
  pages: typeof pages;
  partners: typeof partners;
  process_steps: typeof process_steps;
  reviews: typeof reviews;
  seed: typeof seed;
  service_locations: typeof service_locations;
  services: typeof services;
  site_config: typeof site_config;
  solutions: typeof solutions;
  stats: typeof stats;
  storage: typeof storage;
  team_members: typeof team_members;
  testimonials: typeof testimonials;
  users: typeof users;
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
