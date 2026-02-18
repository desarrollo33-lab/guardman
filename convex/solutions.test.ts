import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// Define mock functions with proper types
const mockQueryFn = vi.fn();
const mockMutationFn = vi.fn();

// Mock the _generated/server module before importing solutions
vi.mock('./_generated/server', () => ({
  query: mockQueryFn,
  mutation: mockMutationFn,
}));

// Mock convex/values
vi.mock('convex/values', () => ({
  v: {
    string: vi.fn(() => 'string'),
    optional: vi.fn((v: unknown) => ({ optional: true, inner: v })),
    array: vi.fn((v: unknown) => ({ array: true, inner: v })),
    boolean: vi.fn(() => 'boolean'),
    number: vi.fn(() => 'number'),
    id: vi.fn((_table: string) => ({ id: _table })),
    object: vi.fn((obj: Record<string, unknown>) => ({ object: obj })),
  },
}));

// Types for function configs
interface FunctionConfig<TArgs = unknown, TReturn = unknown> {
  args?: Record<string, unknown>;
  handler: (ctx: MockDbContext, args: TArgs) => Promise<TReturn>;
  returns?: unknown;
}

// Types for mock database
interface MockDbContext {
  db: {
    query: Mock;
    insert: Mock;
    patch: Mock;
    get: Mock;
  };
}

// Helper to create mock database context
function createMockDbContext(): MockDbContext {
  return {
    db: {
      query: vi.fn(),
      insert: vi.fn(),
      patch: vi.fn(),
      get: vi.fn(),
    },
  };
}

// Helper to get mock calls with proper typing
function getQueryCalls(): FunctionConfig[] {
  return (mockQueryFn as Mock).mock.calls.map(
    (call: unknown[]) => call[0] as FunctionConfig
  );
}

function getMutationCalls(): FunctionConfig[] {
  return (mockMutationFn as Mock).mock.calls.map(
    (call: unknown[]) => call[0] as FunctionConfig
  );
}

// Helper to find createSolution config
function findCreateSolutionConfig(): FunctionConfig | undefined {
  return getMutationCalls().find((config) => {
    const slug = config.args?.slug as { optional?: boolean } | undefined;
    const title = config.args?.title as { optional?: boolean } | undefined;
    return slug?.optional === undefined && title?.optional === undefined;
  });
}

// Helper to find updateSolution config
function findUpdateSolutionConfig(): FunctionConfig | undefined {
  return getMutationCalls().find((config) => {
    const slug = config.args?.slug as { optional?: boolean } | undefined;
    return config.args?.id && slug?.optional === true;
  });
}

// Helper to find deleteSolution config
function findDeleteSolutionConfig(): FunctionConfig | undefined {
  return getMutationCalls().find((config) => {
    return config.args?.id && Object.keys(config.args || {}).length === 1;
  });
}

// Helper to find reorderSolutions config
function findReorderSolutionsConfig(): FunctionConfig | undefined {
  return getMutationCalls().find((config) => config.args?.orders);
}

// Helper to find seedSolutions config
function findSeedSolutionsConfig(): FunctionConfig | undefined {
  return getMutationCalls().find((config) => config.handler && !config.args);
}

describe('solutions module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSolutions query', () => {
    it('should return all solutions from database', async () => {
      const mockSolutions = [
        { _id: 'sol1', slug: 'condominios', title: 'Condominios' },
        { _id: 'sol2', slug: 'mineria', title: 'Minería' },
      ];

      const ctx = createMockDbContext();
      ctx.db.query.mockReturnValue({
        collect: vi.fn().mockResolvedValue(mockSolutions),
      });

      const queryCalls = getQueryCalls();
      const getAllSolutionsConfig = queryCalls[0];

      const result = await getAllSolutionsConfig.handler(ctx);

      expect(ctx.db.query).toHaveBeenCalledWith('solutions');
      expect(result).toEqual(mockSolutions);
    });
  });

  describe('getSolutionBySlug query', () => {
    it('should return solution when slug exists', async () => {
      const mockSolution = {
        _id: 'sol1',
        slug: 'condominios',
        title: 'Condominios Residenciales',
      };

      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(mockSolution),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);

      const queryCalls = getQueryCalls();
      const getSolutionBySlugConfig = queryCalls[1];

      const result = await getSolutionBySlugConfig.handler(ctx, {
        slug: 'condominios',
      });

      expect(ctx.db.query).toHaveBeenCalledWith('solutions');
      expect(mockChain.withIndex).toHaveBeenCalledWith(
        'by_slug',
        expect.any(Function)
      );
      expect(result).toEqual(mockSolution);
    });

    it('should return null when slug does not exist', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(null),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);

      const queryCalls = getQueryCalls();
      const getSolutionBySlugConfig = queryCalls[1];

      const result = await getSolutionBySlugConfig.handler(ctx, {
        slug: 'non-existent',
      });

      expect(result).toBeNull();
    });
  });

  describe('createSolution mutation', () => {
    it('should create solution with valid data', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(null),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);
      ctx.db.insert.mockResolvedValue('new-sol-id');

      const createSolutionConfig = findCreateSolutionConfig();
      const args = {
        slug: 'nueva-solucion',
        title: 'Nueva Solución',
        description: 'Descripción de prueba',
      };

      const result = await createSolutionConfig!.handler(ctx, args);

      expect(ctx.db.insert).toHaveBeenCalledWith({
        ...args,
        is_active: true,
      });
      expect(result).toBe('new-sol-id');
    });

    it('should set is_active to true by default', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(null),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);
      ctx.db.insert.mockResolvedValue('new-sol-id');

      const createSolutionConfig = findCreateSolutionConfig();

      await createSolutionConfig!.handler(ctx, {
        slug: 'test-slug',
        title: 'Test',
        description: 'Test desc',
      });

      expect(ctx.db.insert).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: true })
      );
    });

    it('should allow is_active to be set to false', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(null),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);
      ctx.db.insert.mockResolvedValue('new-sol-id');

      const createSolutionConfig = findCreateSolutionConfig();

      await createSolutionConfig!.handler(ctx, {
        slug: 'inactive-slug',
        title: 'Inactive',
        description: 'Test',
        is_active: false,
      });

      expect(ctx.db.insert).toHaveBeenCalledWith(
        expect.objectContaining({ is_active: false })
      );
    });

    it('should throw error when slug already exists', async () => {
      const existingSolution = {
        _id: 'existing-id',
        slug: 'existing-slug',
        title: 'Existing Solution',
      };

      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(existingSolution),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);

      const createSolutionConfig = findCreateSolutionConfig();

      await expect(
        createSolutionConfig!.handler(ctx, {
          slug: 'existing-slug',
          title: 'New Title',
          description: 'New description',
        })
      ).rejects.toThrow('Solution with this slug already exists');
    });

    it('should handle relatedServices array', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(null),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);
      ctx.db.insert.mockResolvedValue('new-sol-id');

      const createSolutionConfig = findCreateSolutionConfig();
      const relatedServices = [
        'guardias-seguridad',
        'alarmas-ajax',
        'control-acceso',
      ];

      await createSolutionConfig!.handler(ctx, {
        slug: 'test-slug',
        title: 'Test',
        description: 'Test',
        relatedServices,
      });

      expect(ctx.db.insert).toHaveBeenCalledWith(
        expect.objectContaining({ relatedServices })
      );
    });

    it('should handle optional fields', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(null),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);
      ctx.db.insert.mockResolvedValue('new-sol-id');

      const createSolutionConfig = findCreateSolutionConfig();

      await createSolutionConfig!.handler(ctx, {
        slug: 'full-solution',
        title: 'Full Solution',
        description: 'Complete solution',
        icon: 'building',
        features: ['Feature 1', 'Feature 2'],
        benefits: ['Benefit 1'],
        cta: 'Contact us',
        industries: ['Retail', 'Mining'],
        meta_title: 'SEO Title',
        meta_description: 'SEO Description',
        og_image: 'https://example.com/image.jpg',
        solutions: ['solution-1', 'solution-2'],
        image: 'https://example.com/hero.jpg',
        challenges: ['Challenge 1'],
        relatedServices: ['service-1'],
        order: 5,
      });

      expect(ctx.db.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'building',
          features: ['Feature 1', 'Feature 2'],
          benefits: ['Benefit 1'],
          cta: 'Contact us',
          industries: ['Retail', 'Mining'],
          meta_title: 'SEO Title',
          meta_description: 'SEO Description',
          og_image: 'https://example.com/image.jpg',
          solutions: ['solution-1', 'solution-2'],
          image: 'https://example.com/hero.jpg',
          challenges: ['Challenge 1'],
          relatedServices: ['service-1'],
          order: 5,
        })
      );
    });
  });

  describe('updateSolution mutation', () => {
    it('should update solution with partial data', async () => {
      const ctx = createMockDbContext();
      const updatedSolution = {
        _id: 'sol-id',
        title: 'Updated Title',
        description: 'Updated description',
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedSolution);

      const updateSolutionConfig = findUpdateSolutionConfig();

      const result = await updateSolutionConfig!.handler(ctx, {
        id: 'sol-id',
        title: 'Updated Title',
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('sol-id', {
        title: 'Updated Title',
      });
      expect(ctx.db.get).toHaveBeenCalledWith('sol-id');
      expect(result).toEqual(updatedSolution);
    });

    it('should filter out undefined values in updates', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue({ _id: 'sol-id' });

      const updateSolutionConfig = findUpdateSolutionConfig();

      await updateSolutionConfig!.handler(ctx, {
        id: 'sol-id',
        title: 'New Title',
        description: undefined,
        icon: undefined,
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('sol-id', {
        title: 'New Title',
      });
    });

    it('should update relatedServices array', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue({ _id: 'sol-id' });

      const updateSolutionConfig = findUpdateSolutionConfig();
      const newRelatedServices = ['new-service-1', 'new-service-2'];

      await updateSolutionConfig!.handler(ctx, {
        id: 'sol-id',
        relatedServices: newRelatedServices,
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('sol-id', {
        relatedServices: newRelatedServices,
      });
    });

    it('should update multiple fields at once', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue({ _id: 'sol-id' });

      const updateSolutionConfig = findUpdateSolutionConfig();

      await updateSolutionConfig!.handler(ctx, {
        id: 'sol-id',
        title: 'New Title',
        description: 'New Description',
        is_active: false,
        order: 10,
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('sol-id', {
        title: 'New Title',
        description: 'New Description',
        is_active: false,
        order: 10,
      });
    });

    it('should return the updated solution', async () => {
      const ctx = createMockDbContext();
      const updatedSolution = {
        _id: 'sol-id',
        title: 'Updated',
        is_active: true,
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedSolution);

      const updateSolutionConfig = findUpdateSolutionConfig();

      const result = await updateSolutionConfig!.handler(ctx, {
        id: 'sol-id',
        title: 'Updated',
      });

      expect(result).toEqual(updatedSolution);
    });
  });

  describe('deleteSolution mutation', () => {
    it('should soft delete solution by setting is_active to false', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);

      const deleteSolutionConfig = findDeleteSolutionConfig();

      await deleteSolutionConfig!.handler(ctx, { id: 'sol-to-delete' });

      expect(ctx.db.patch).toHaveBeenCalledWith('sol-to-delete', {
        is_active: false,
      });
    });

    it('should not permanently delete from database', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);

      const deleteSolutionConfig = findDeleteSolutionConfig();

      await deleteSolutionConfig!.handler(ctx, { id: 'sol-to-delete' });

      expect(ctx.db.patch).toHaveBeenCalled();
    });
  });

  describe('reorderSolutions mutation', () => {
    it('should update order for multiple solutions', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);

      const reorderConfig = findReorderSolutionsConfig();

      await reorderConfig!.handler(ctx, {
        orders: [
          { id: 'sol1', order: 1 },
          { id: 'sol2', order: 2 },
          { id: 'sol3', order: 3 },
        ],
      });

      expect(ctx.db.patch).toHaveBeenCalledTimes(3);
      expect(ctx.db.patch).toHaveBeenNthCalledWith(1, 'sol1', { order: 1 });
      expect(ctx.db.patch).toHaveBeenNthCalledWith(2, 'sol2', { order: 2 });
      expect(ctx.db.patch).toHaveBeenNthCalledWith(3, 'sol3', { order: 3 });
    });

    it('should handle empty orders array', async () => {
      const ctx = createMockDbContext();
      ctx.db.patch.mockResolvedValue(undefined);

      const reorderConfig = findReorderSolutionsConfig();

      await reorderConfig!.handler(ctx, { orders: [] });

      expect(ctx.db.patch).not.toHaveBeenCalled();
    });
  });

  describe('slug uniqueness', () => {
    it('should enforce slug uniqueness on create', async () => {
      const ctx = createMockDbContext();
      const existingSolution = {
        _id: 'existing-id',
        slug: 'duplicate-slug',
        title: 'Existing',
      };
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockResolvedValue(existingSolution),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);

      const createSolutionConfig = findCreateSolutionConfig();

      await expect(
        createSolutionConfig!.handler(ctx, {
          slug: 'duplicate-slug',
          title: 'New Solution',
          description: 'Description',
        })
      ).rejects.toThrow('Solution with this slug already exists');

      expect(ctx.db.insert).not.toHaveBeenCalled();
    });
  });

  describe('seedSolutions mutation', () => {
    it('should insert new solutions and skip existing ones', async () => {
      const ctx = createMockDbContext();

      let callCount = 0;
      ctx.db.query.mockImplementation(() => ({
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            first: vi.fn().mockImplementation(() => {
              callCount++;
              if (callCount === 1) {
                return Promise.resolve({
                  _id: 'existing-id',
                  slug: 'condominios',
                });
              }
              return Promise.resolve(null);
            }),
          })),
        })),
      }));
      ctx.db.insert.mockResolvedValue('new-id');
      ctx.db.patch.mockResolvedValue(undefined);

      const seedConfig = findSeedSolutionsConfig();

      const result = (await seedConfig!.handler(ctx)) as {
        inserted: number;
        skipped: number;
        total: number;
      };

      expect(result).toHaveProperty('inserted');
      expect(result).toHaveProperty('skipped');
      expect(result).toHaveProperty('total');
    });
  });
});
