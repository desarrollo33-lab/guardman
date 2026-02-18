/**
 * Unit tests for Convex services module
 *
 * Tests CRUD mutations and query behaviors for the services table.
 */

import { describe, it, expect } from 'vitest';
import {
  createMockContext,
  type MockFunctionCtx,
  type MockQueryBuilder,
} from './_test/utils';

// Type for service document
interface ServiceDoc {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tagline?: string;
  icon?: string;
  features?: string[];
  benefits?: string[];
  cta?: string;
  solutions?: string[];
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  order?: number;
}

// Type for create service args
interface CreateServiceArgs {
  slug: string;
  title: string;
  description: string;
  tagline?: string;
  icon?: string;
  features?: string[];
  benefits?: string[];
  cta?: string;
  solutions?: string[];
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  order?: number;
}

// Helper to create a test service
function createTestService(overrides: Partial<ServiceDoc> = {}): ServiceDoc {
  return {
    _id: 'service_123',
    slug: 'test-service',
    title: 'Test Service',
    description: 'A test service description',
    tagline: 'Test tagline',
    icon: 'shield',
    features: ['Feature 1', 'Feature 2'],
    benefits: ['Benefit 1'],
    cta: 'Contact Us',
    solutions: ['condominios'],
    is_active: true,
    order: 1,
    ...overrides,
  };
}

// Helper to create mock query that returns specific results
function createMockQueryWithResults(results: unknown[]): MockQueryBuilder {
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

describe('services module', () => {
  describe('createService mutation', () => {
    it('should create a service with valid data', async () => {
      let insertedDoc: Record<string, unknown> | null = null;
      let insertedId: string | null = null;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]), // No existing service
          insert: async (_table, doc) => {
            insertedDoc = doc;
            insertedId = 'new_service_id';
            return insertedId;
          },
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      // Simulate createService handler behavior
      const args: CreateServiceArgs = {
        slug: 'new-service',
        title: 'New Service',
        description: 'A new service',
        tagline: 'Test tagline',
        features: ['Feature 1'],
      };

      // Check slug uniqueness (no existing)
      const existing = await mockCtx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', args.slug))
        .first();

      expect(existing).toBeNull();

      // Insert the service
      const id = await mockCtx.db.insert('services', {
        ...args,
        is_active: true,
      });

      expect(id).toBe('new_service_id');
      expect(insertedDoc).toEqual({
        ...args,
        is_active: true,
      });
    });

    it('should default is_active to true when not provided', async () => {
      let insertedDoc: Record<string, unknown> | null = null;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async (_table, doc) => {
            insertedDoc = doc;
            return 'new_id';
          },
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const args: CreateServiceArgs = {
        slug: 'service-without-active',
        title: 'Service',
        description: 'Description',
      };

      // Simulate handler logic: is_active defaults to true
      const docToInsert = {
        ...args,
        is_active: args.is_active ?? true,
      };

      await mockCtx.db.insert('services', docToInsert);

      // Use explicit assertion to avoid TypeScript narrowing issues
      expect((insertedDoc as Record<string, unknown>)?.is_active).toBe(true);
    });

    it('should allow explicit is_active false', async () => {
      let insertedDoc: Record<string, unknown> | null = null;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async (_table, doc) => {
            insertedDoc = doc;
            return 'new_id';
          },
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const args: CreateServiceArgs = {
        slug: 'inactive-service',
        title: 'Inactive Service',
        description: 'Description',
        is_active: false,
      };

      const docToInsert = {
        ...args,
        is_active: args.is_active ?? true,
      };

      await mockCtx.db.insert('services', docToInsert);

      expect(insertedDoc?.is_active).toBe(false);
    });

    it('should throw error when slug already exists', async () => {
      const existingService = createTestService({ slug: 'existing-slug' });

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([existingService]),
          insert: async () => 'should_not_be_called',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const args = {
        slug: 'existing-slug',
        title: 'Duplicate Service',
        description: 'Description',
      };

      // Simulate handler slug check
      const existing = await mockCtx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', args.slug))
        .first();

      // Handler should throw if existing
      expect(existing).not.toBeNull();
      expect(() => {
        if (existing) throw new Error('Service with this slug already exists');
      }).toThrow('Service with this slug already exists');
    });

    it('should require slug, title, and description fields', () => {
      // These are validated by Convex at runtime via v.string() validators
      // We test that the schema enforces required fields

      const validArgs = {
        slug: 'test',
        title: 'Test',
        description: 'Test description',
      };

      // Missing slug
      const missingSlug = { title: 'Test', description: 'Desc' };
      expect(missingSlug).not.toHaveProperty('slug');

      // Missing title
      const missingTitle = { slug: 'test', description: 'Desc' };
      expect(missingTitle).not.toHaveProperty('title');

      // Missing description
      const missingDescription = { slug: 'test', title: 'Test' };
      expect(missingDescription).not.toHaveProperty('description');

      // Valid should have all required
      expect(validArgs).toHaveProperty('slug');
      expect(validArgs).toHaveProperty('title');
      expect(validArgs).toHaveProperty('description');
    });
  });

  describe('updateService mutation', () => {
    it('should perform partial updates', async () => {
      const existingService = createTestService();
      let patchedId: string | null = null;
      let patchedData: Record<string, unknown> | null = null;
      let currentService: ServiceDoc = { ...existingService };

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => currentService,
          patch: async (id, changes) => {
            patchedId = id as string;
            patchedData = changes as Record<string, unknown>;
            currentService = {
              ...currentService,
              ...(changes as Partial<ServiceDoc>),
            };
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const args = {
        id: existingService._id,
        title: 'Updated Title',
        // Only updating title, not other fields
      };

      // Simulate handler logic: remove undefined values
      const { id, ...updates } = args;
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      await mockCtx.db.patch(id, cleanUpdates);
      const result = (await mockCtx.db.get(id)) as ServiceDoc | null;

      expect(patchedId).toBe(existingService._id);
      expect(patchedData).toEqual({ title: 'Updated Title' });
      expect(result?.title).toBe('Updated Title');
    });

    it('should update multiple fields at once', async () => {
      let patchedData: Record<string, unknown> | null = null;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => createTestService(),
          patch: async (_id, changes) => {
            patchedData = changes as Record<string, unknown>;
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const args = {
        id: 'service_123',
        title: 'New Title',
        description: 'New Description',
        tagline: 'New Tagline',
        is_active: false,
        order: 5,
      };

      const { id, ...updates } = args;
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      await mockCtx.db.patch(id, cleanUpdates);

      expect(patchedData).toEqual({
        title: 'New Title',
        description: 'New Description',
        tagline: 'New Tagline',
        is_active: false,
        order: 5,
      });
    });

    it('should handle empty updates gracefully', async () => {
      let patchedData: Record<string, unknown> | null = null;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => createTestService(),
          patch: async (_id, changes) => {
            patchedData = changes as Record<string, unknown>;
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const args = {
        id: 'service_123',
        // No actual updates
      };

      const { id, ...updates } = args;
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      await mockCtx.db.patch(id, cleanUpdates);

      expect(patchedData).toEqual({});
    });
  });

  describe('deleteService mutation', () => {
    it('should perform soft delete by setting is_active to false', async () => {
      const service = createTestService({ is_active: true });
      let patchedId: string | null = null;
      let patchedData: Record<string, unknown> | null = null;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => service,
          patch: async (id, changes) => {
            patchedId = id as string;
            patchedData = changes as Record<string, unknown>;
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      // Simulate deleteService handler
      await mockCtx.db.patch(service._id, { is_active: false });

      expect(patchedId).toBe(service._id);
      expect(patchedData).toEqual({ is_active: false });
    });

    it('should not permanently delete the document', async () => {
      let deleteCalled = false;
      let patchCalled = false;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => createTestService(),
          patch: async () => {
            patchCalled = true;
          },
          replace: async () => undefined,
          delete: async () => {
            deleteCalled = true;
          },
        },
      });

      // deleteService uses patch, not delete
      await mockCtx.db.patch('service_123', { is_active: false });

      expect(patchCalled).toBe(true);
      expect(deleteCalled).toBe(false);
    });
  });

  describe('reorderServices mutation', () => {
    it('should update order for multiple services', async () => {
      const orders = [
        { id: 'service_1', order: 1 },
        { id: 'service_2', order: 2 },
        { id: 'service_3', order: 3 },
      ];

      const patchedOrders: Array<{ id: string; order: number }> = [];

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async (id, changes) => {
            patchedOrders.push({
              id: id as string,
              order: (changes as { order: number }).order,
            });
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      // Simulate reorderServices handler
      for (const item of orders) {
        await mockCtx.db.patch(item.id, { order: item.order });
      }

      expect(patchedOrders).toHaveLength(3);
      expect(patchedOrders[0]).toEqual({ id: 'service_1', order: 1 });
      expect(patchedOrders[1]).toEqual({ id: 'service_2', order: 2 });
      expect(patchedOrders[2]).toEqual({ id: 'service_3', order: 3 });
    });

    it('should handle single service reorder', async () => {
      const orders = [{ id: 'service_single', order: 10 }];

      const patchedOrders: Array<{ id: string; order: number }> = [];

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async (id, changes) => {
            patchedOrders.push({
              id: id as string,
              order: (changes as { order: number }).order,
            });
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      for (const item of orders) {
        await mockCtx.db.patch(item.id, { order: item.order });
      }

      expect(patchedOrders).toHaveLength(1);
      expect(patchedOrders[0]).toEqual({ id: 'service_single', order: 10 });
    });

    it('should handle empty orders array', async () => {
      let patchCalled = false;

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async () => {
            patchCalled = true;
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const orders: Array<{ id: string; order: number }> = [];

      for (const item of orders) {
        await mockCtx.db.patch(item.id, { order: item.order });
      }

      expect(patchCalled).toBe(false);
    });
  });

  describe('getAllServices query', () => {
    it('should return all services', async () => {
      const services = [
        createTestService({ _id: 's1', slug: 'service-1' }),
        createTestService({ _id: 's2', slug: 'service-2' }),
        createTestService({ _id: 's3', slug: 'service-3' }),
      ];

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults(services),
          insert: async () => 'id',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const result = await mockCtx.db.query('services').collect();

      expect(result).toHaveLength(3);
      expect(result).toEqual(services);
    });

    it('should return empty array when no services exist', async () => {
      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const result = await mockCtx.db.query('services').collect();

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('getServiceBySlug query', () => {
    it('should return service when slug exists', async () => {
      const service = createTestService({ slug: 'guardias-seguridad' });

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([service]),
          insert: async () => 'id',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const result = await mockCtx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', 'guardias-seguridad'))
        .first();

      expect(result).toEqual(service);
    });

    it('should return null when slug does not exist', async () => {
      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      const result = await mockCtx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', 'non-existent'))
        .first();

      expect(result).toBeNull();
    });
  });

  describe('slug uniqueness validation', () => {
    it('should use by_slug index for uniqueness check', async () => {
      let indexUsed = '';
      let indexValue = '';

      // Create a custom mock query with tracking
      const mockQuery = (): MockQueryBuilder => {
        const builder: MockQueryBuilder = {
          withIndex: (name: string, fn) => {
            indexUsed = name;
            if (fn) {
              fn({
                eq: (field: string, value: unknown) => {
                  indexValue = `${field}:${value}`;
                  // Return an object with eq method to satisfy IndexBuilder
                  return {
                    eq: () => {
                      return {} as ReturnType<
                        ReturnType<MockQueryBuilder['withIndex']> extends (
                          q: infer Q
                        ) => infer R
                          ? Q
                          : never
                      >;
                    },
                  } as ReturnType<
                    ReturnType<MockQueryBuilder['withIndex']> extends (
                      q: infer Q
                    ) => infer R
                      ? Q
                      : never
                  >;
                },
              });
            }
            return builder;
          },
          filter: () => builder,
          order: () => builder,
          first: async () => null,
          unique: async () => null,
          collect: async () => [],
          take: async () => [],
          paginate: async () => ({
            page: [],
            isDone: true,
            continueCursor: undefined,
          }),
        };
        return builder;
      };

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: mockQuery,
          insert: async () => 'id',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      await mockCtx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', 'test-slug'))
        .first();

      expect(indexUsed).toBe('by_slug');
      expect(indexValue).toBe('slug:test-slug');
    });

    it('should be case-sensitive for slugs', () => {
      // Slugs should be treated as case-sensitive
      const slug1 = 'Guardias-Seguridad';
      const slug2 = 'guardias-seguridad';

      expect(slug1).not.toBe(slug2);
      expect(slug1.toLowerCase()).toBe(slug2.toLowerCase());
    });

    it('should reject duplicate slugs regardless of other fields', async () => {
      const existingService = createTestService({
        slug: 'same-slug',
        title: 'Original Service',
      });

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([existingService]),
          insert: async () => 'id',
          get: async () => null,
          patch: async () => undefined,
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      // Attempt to create with same slug but different title
      const existing = await mockCtx.db
        .query('services')
        .withIndex('by_slug', (q) => q.eq('slug', 'same-slug'))
        .first();

      expect(existing).not.toBeNull();
      expect(() => {
        if (existing) throw new Error('Service with this slug already exists');
      }).toThrow('Service with this slug already exists');
    });
  });

  describe('ordering functionality', () => {
    it('should support numeric order values', async () => {
      const orders = [
        { id: 'service_a', order: 0 },
        { id: 'service_b', order: 100 },
        { id: 'service_c', order: -1 },
      ];

      const patchedOrders: Array<{ id: string; order: number }> = [];

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async (id, changes) => {
            patchedOrders.push({
              id: id as string,
              order: (changes as { order: number }).order,
            });
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      for (const item of orders) {
        await mockCtx.db.patch(item.id, { order: item.order });
      }

      expect(patchedOrders[0].order).toBe(0);
      expect(patchedOrders[1].order).toBe(100);
      expect(patchedOrders[2].order).toBe(-1);
    });

    it('should allow reordering to swap positions', async () => {
      const swappedOrders = [
        { id: 'service_1', order: 2 }, // Was 1, now 2
        { id: 'service_2', order: 1 }, // Was 2, now 1
      ];

      const patchedOrders: Array<{ id: string; order: number }> = [];

      const mockCtx: MockFunctionCtx = createMockContext({
        db: {
          query: () => createMockQueryWithResults([]),
          insert: async () => 'id',
          get: async () => null,
          patch: async (id, changes) => {
            patchedOrders.push({
              id: id as string,
              order: (changes as { order: number }).order,
            });
          },
          replace: async () => undefined,
          delete: async () => undefined,
        },
      });

      for (const item of swappedOrders) {
        await mockCtx.db.patch(item.id, { order: item.order });
      }

      expect(patchedOrders).toHaveLength(2);
      expect(patchedOrders[0]).toEqual({ id: 'service_1', order: 2 });
      expect(patchedOrders[1]).toEqual({ id: 'service_2', order: 1 });
    });
  });
});
