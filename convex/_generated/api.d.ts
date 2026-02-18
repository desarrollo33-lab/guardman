/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as communes from "../communes.js";
import type * as content_blocks from "../content_blocks.js";
import type * as faqs from "../faqs.js";
import type * as leads from "../leads.js";
import type * as locations from "../locations.js";
import type * as pages from "../pages.js";
import type * as partners from "../partners.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as site_config from "../site_config.js";
import type * as solutions from "../solutions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  communes: typeof communes;
  content_blocks: typeof content_blocks;
  faqs: typeof faqs;
  leads: typeof leads;
  locations: typeof locations;
  pages: typeof pages;
  partners: typeof partners;
  seed: typeof seed;
  services: typeof services;
  site_config: typeof site_config;
  solutions: typeof solutions;
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
