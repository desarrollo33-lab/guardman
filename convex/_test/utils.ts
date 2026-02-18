/**
 * Test Utilities for Convex Functions
 *
 * This file provides helper functions and patterns for testing
 * Convex queries, mutations, and actions.
 *
 * Note: Convex functions typically need to be tested against a real
 * deployment or using the Convex testing framework. These utilities
 * provide patterns for organizing tests.
 */

import type { Id, TableNames } from '../_generated/dataModel';

/**
 * Generic ID type for mocking purposes (string representation of Convex IDs)
 */
type MockId = string;

/**
 * Creates a mock context object for testing Convex functions.
 *
 * Usage:
 * ```typescript
 * const mockCtx = createMockContext();
 * // Override specific methods as needed
 * mockCtx.db.get = async (id) => ({ _id: id, name: 'Test' });
 * ```
 */
export function createMockContext(
  overrides: Partial<MockFunctionCtx> = {}
): MockFunctionCtx {
  const defaultDb: MockDatabase = {
    get: async () => null,
    query: () => createMockQuery(),
    insert: async () => 'mock_id' as MockId,
    patch: async () => undefined,
    replace: async () => undefined,
    delete: async () => undefined,
  };

  const defaultAuth: MockAuth = {
    getUserIdentity: async () => null,
  };

  return {
    db: { ...defaultDb, ...overrides.db },
    auth: { ...defaultAuth, ...overrides.auth },
    ...overrides,
  };
}

/**
 * Creates a mock query builder for testing chained query operations.
 */
function createMockQuery(): MockQueryBuilder {
  const results: unknown[] = [];

  const builder: MockQueryBuilder = {
    withIndex: () => builder,
    filter: () => builder,
    order: () => builder,
    first: async () => results[0] ?? null,
    unique: async () => results[0] ?? null,
    collect: async () => results,
    take: async (n: number) => results.slice(0, n),
    paginate: async () => ({
      page: results,
      isDone: true,
      continueCursor: undefined,
    }),
  };

  return builder;
}

// Type definitions for mock objects

export interface MockDatabase {
  get: (id: MockId) => Promise<unknown | null>;
  query: (tableName: TableNames) => MockQueryBuilder;
  insert: (
    table: TableNames,
    document: Record<string, unknown>
  ) => Promise<MockId>;
  patch: (
    id: MockId,
    changes: Partial<Record<string, unknown>>
  ) => Promise<void>;
  replace: (id: MockId, document: Record<string, unknown>) => Promise<void>;
  delete: (id: MockId) => Promise<void>;
}

export interface MockQueryBuilder {
  withIndex: (
    name: string,
    fn?: (q: IndexBuilder) => IndexBuilder
  ) => MockQueryBuilder;
  filter: (fn: (q: FilterBuilder) => boolean) => MockQueryBuilder;
  order: (order: 'asc' | 'desc') => MockQueryBuilder;
  first: () => Promise<unknown | null>;
  unique: () => Promise<unknown | null>;
  collect: () => Promise<unknown[]>;
  take: (n: number) => Promise<unknown[]>;
  paginate: (opts: { cursor?: string; pageSize?: number }) => Promise<{
    page: unknown[];
    isDone: boolean;
    continueCursor: string | undefined;
  }>;
}

export interface IndexBuilder {
  eq: (field: string, value: unknown) => IndexBuilder;
}

export interface FilterBuilder {
  eq: (a: unknown, b: unknown) => boolean;
  field: (name: string) => unknown;
}

export interface MockAuth {
  getUserIdentity: () => Promise<{
    subject: string;
    name?: string;
    email?: string;
    phone?: string;
    givenName?: string;
    familyName?: string;
    nickname?: string;
    preferredUsername?: string;
    gender?: string;
    birthdate?: string;
    pictureUrl?: string;
    locale?: string;
    expiresAt?: number;
    tokenIdentifier: string;
    issuer: string;
  } | null>;
}

export interface MockFunctionCtx {
  db: MockDatabase;
  auth: MockAuth;
  scheduler?: {
    runAfter: (
      delay: number,
      functionHandle: string,
      args?: unknown
    ) => Promise<void>;
    runAt: (
      timestamp: number,
      functionHandle: string,
      args?: unknown
    ) => Promise<void>;
  };
  storage?: {
    store: (blob: Blob) => Promise<Id<'_storage'>>;
    get: (id: Id<'_storage'>) => Promise<Blob | null>;
    delete: (id: Id<'_storage'>) => Promise<void>;
  };
}

/**
 * Helper to create test data fixtures.
 * Use this to generate consistent test data across tests.
 */
export function createTestLead(overrides: Partial<TestLead> = {}): TestLead {
  return {
    name: 'Test User',
    phone: '+56912345678',
    email: 'test@example.com',
    service: 'Guardias de Seguridad',
    message: 'Test message',
    status: 'new',
    source: 'test',
    createdAt: Date.now(),
    ...overrides,
  };
}

export interface TestLead {
  name: string;
  phone: string;
  email?: string;
  service: string;
  message?: string;
  status: string;
  source?: string;
  createdAt: number;
}

/**
 * Wait for a condition to be true, useful for async testing.
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options;
  const start = Date.now();

  while (!(await condition())) {
    if (Date.now() - start > timeout) {
      throw new Error('waitFor timeout exceeded');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}
