import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the _generated/server module before importing heroes
vi.mock('./_generated/server', () => ({
  query: vi.fn((config) => config),
  mutation: vi.fn((config) => config),
}));

// Mock convex/values
vi.mock('convex/values', () => ({
  v: {
    string: vi.fn(() => 'string'),
    optional: vi.fn((v) => ({ optional: true, inner: v })),
    array: vi.fn((v) => ({ array: true, inner: v })),
    boolean: vi.fn(() => 'boolean'),
    number: vi.fn(() => 'number'),
    id: vi.fn((table: string) => ({ id: table })),
    object: vi.fn((obj: Record<string, unknown>) => ({ object: obj })),
    union: vi.fn((...args: unknown[]) => ({ union: args })),
    literal: vi.fn((val: unknown) => ({ literal: val })),
  },
}));

// Import after mocking
import './heroes';
import { query, mutation } from './_generated/server';

// Helper to create mock database context
function createMockDbContext() {
  return {
    db: {
      query: vi.fn(),
      insert: vi.fn(),
      patch: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    },
  };
}

// Helper to create mock query chain
function createMockQueryChain(result: unknown) {
  return {
    withIndex: vi.fn(() => ({
      eq: vi.fn(() => ({
        first: vi.fn().mockResolvedValue(result),
      })),
    })),
    collect: vi.fn().mockResolvedValue(result),
    filter: vi.fn(() => ({
      first: vi.fn().mockResolvedValue(result),
    })),
    first: vi.fn().mockResolvedValue(result),
  };
}

describe('heroes module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllHeroes query', () => {
    it('should return all heroes from the database', async () => {
      const mockHeroes = [
        {
          _id: 'hero1',
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
        },
        {
          _id: 'hero2',
          page_slug: 'servicios',
          title: 'Services Hero',
          background_type: 'youtube',
        },
      ];

      const ctx = createMockDbContext();
      ctx.db.query.mockReturnValue(createMockQueryChain(mockHeroes));

      // Get the handler from the query definition
      const queryCalls = query.mock.calls;
      const getAllHeroesConfig = queryCalls[0]?.[0];

      const result = await getAllHeroesConfig.handler(ctx);

      expect(ctx.db.query).toHaveBeenCalledWith('heroes');
      expect(result).toEqual(mockHeroes);
    });

    it('should return empty array when no heroes exist', async () => {
      const ctx = createMockDbContext();
      ctx.db.query.mockReturnValue(createMockQueryChain([]));

      const queryCalls = query.mock.calls;
      const getAllHeroesConfig = queryCalls[0]?.[0];

      const result = await getAllHeroesConfig.handler(ctx);

      expect(result).toEqual([]);
    });
  });

  describe('getHeroByPage query', () => {
    it('should return active hero for given page_slug', async () => {
      const mockHero = {
        _id: 'hero1',
        page_slug: 'home',
        title: 'Home Hero',
        background_type: 'image',
        is_active: true,
      };

      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            filter: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(mockHero),
            })),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);

      // Get the getHeroByPage handler (second query call)
      const queryCalls = query.mock.calls;
      const getHeroByPageConfig = queryCalls[1]?.[0];

      const result = await getHeroByPageConfig.handler(ctx, {
        page_slug: 'home',
      });

      expect(ctx.db.query).toHaveBeenCalledWith('heroes');
      expect(mockChain.withIndex).toHaveBeenCalledWith(
        'by_page_slug',
        expect.any(Function)
      );
      expect(result).toEqual(mockHero);
    });

    it('should return null when no active hero found for page_slug', async () => {
      const ctx = createMockDbContext();
      const mockChain = {
        withIndex: vi.fn(() => ({
          eq: vi.fn(() => ({
            filter: vi.fn(() => ({
              first: vi.fn().mockResolvedValue(null),
            })),
          })),
        })),
      };
      ctx.db.query.mockReturnValue(mockChain);

      const queryCalls = query.mock.calls;
      const getHeroByPageConfig = queryCalls[1]?.[0];

      const result = await getHeroByPageConfig.handler(ctx, {
        page_slug: 'nonexistent',
      });

      expect(result).toBeNull();
    });
  });

  describe('getActiveHeroes query', () => {
    it('should return only active heroes', async () => {
      const mockActiveHeroes = [
        {
          _id: 'hero1',
          page_slug: 'home',
          title: 'Home Hero',
          is_active: true,
        },
        {
          _id: 'hero2',
          page_slug: 'servicios',
          title: 'Services Hero',
          is_active: true,
        },
      ];

      const ctx = createMockDbContext();
      ctx.db.query.mockReturnValue(createMockQueryChain(mockActiveHeroes));

      // Get the getActiveHeroes handler (third query call)
      const queryCalls = query.mock.calls;
      const getActiveHeroesConfig = queryCalls[2]?.[0];

      const result = await getActiveHeroesConfig.handler(ctx);

      expect(ctx.db.query).toHaveBeenCalledWith('heroes');
      expect(result).toEqual(mockActiveHeroes);
    });
  });

  describe('createHero mutation', () => {
    describe('YouTube background type validation', () => {
      it('should create hero with youtube background when youtube_id is provided', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero1');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'youtube',
          youtube_id: 'dQw4w9WgXcQ',
        };

        const result = await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith('heroes', {
          ...heroData,
          is_active: true,
        });
        expect(result).toBe('hero1');
      });

      it('should throw error when youtube background_type is set but youtube_id is missing', async () => {
        const ctx = createMockDbContext();

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'youtube',
        };

        await expect(createHeroConfig.handler(ctx, heroData)).rejects.toThrow(
          'youtube_id is required for youtube background type'
        );

        expect(ctx.db.insert).not.toHaveBeenCalled();
      });

      it('should throw error when youtube background_type is set but youtube_id is empty string', async () => {
        const ctx = createMockDbContext();

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'youtube',
          youtube_id: '',
        };

        await expect(createHeroConfig.handler(ctx, heroData)).rejects.toThrow(
          'youtube_id is required for youtube background type'
        );
      });
    });

    describe('Image background type validation', () => {
      it('should create hero with image background when image_url is provided', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero2');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'servicios',
          title: 'Services Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
        };

        const result = await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith('heroes', {
          ...heroData,
          is_active: true,
        });
        expect(result).toBe('hero2');
      });

      it('should throw error when image background_type is set but image_url is missing', async () => {
        const ctx = createMockDbContext();

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'servicios',
          title: 'Services Hero',
          background_type: 'image',
        };

        await expect(createHeroConfig.handler(ctx, heroData)).rejects.toThrow(
          'image_url is required for image background type'
        );

        expect(ctx.db.insert).not.toHaveBeenCalled();
      });
    });

    describe('CTAs array handling', () => {
      it('should create hero with multiple CTAs', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero3');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
          ctas: [
            { text: 'Contact Us', href: '/contacto', variant: 'primary' },
            { text: 'Learn More', href: '/servicios', variant: 'secondary' },
          ],
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            ctas: heroData.ctas,
          })
        );
      });

      it('should create hero with CTA without variant (optional)', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero4');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
          ctas: [{ text: 'Click Here', href: '/contacto' }],
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            ctas: [{ text: 'Click Here', href: '/contacto' }],
          })
        );
      });
    });

    describe('Badges array handling', () => {
      it('should create hero with badges including icons', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero5');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
          badges: [
            { text: 'Certified', icon: 'shield' },
            { text: 'Trusted', icon: 'star' },
          ],
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            badges: heroData.badges,
          })
        );
      });

      it('should create hero with badges without icons (optional)', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero6');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
          badges: [{ text: 'Premium' }],
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            badges: [{ text: 'Premium' }],
          })
        );
      });
    });

    describe('is_active default value', () => {
      it('should default is_active to true when not provided', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero7');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            is_active: true,
          })
        );
      });

      it('should allow is_active to be set to false', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero8');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Inactive Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero.jpg',
          is_active: false,
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            is_active: false,
          })
        );
      });
    });

    describe('Mobile image URL', () => {
      it('should accept mobile_image_url for responsive heroes', async () => {
        const ctx = createMockDbContext();
        ctx.db.insert.mockResolvedValue('hero9');

        const mutationCalls = mutation.mock.calls;
        const createHeroConfig = mutationCalls[0]?.[0];

        const heroData = {
          page_slug: 'home',
          title: 'Home Hero',
          background_type: 'image',
          image_url: 'https://example.com/hero-desktop.jpg',
          mobile_image_url: 'https://example.com/hero-mobile.jpg',
        };

        await createHeroConfig.handler(ctx, heroData);

        expect(ctx.db.insert).toHaveBeenCalledWith(
          'heroes',
          expect.objectContaining({
            mobile_image_url: 'https://example.com/hero-mobile.jpg',
          })
        );
      });
    });
  });

  describe('updateHero mutation', () => {
    it('should update hero title', async () => {
      const ctx = createMockDbContext();
      const updatedHero = {
        _id: 'hero1',
        page_slug: 'home',
        title: 'Updated Title',
        background_type: 'image',
        is_active: true,
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      const result = await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        title: 'Updated Title',
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', {
        title: 'Updated Title',
      });
      expect(ctx.db.get).toHaveBeenCalledWith('hero1');
      expect(result).toEqual(updatedHero);
    });

    it('should update multiple fields at once', async () => {
      const ctx = createMockDbContext();
      const updatedHero = {
        _id: 'hero1',
        page_slug: 'servicios',
        title: 'New Title',
        subtitle: 'New Subtitle',
        background_type: 'youtube',
        youtube_id: 'newVideoId',
        is_active: true,
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      const result = await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        page_slug: 'servicios',
        title: 'New Title',
        subtitle: 'New Subtitle',
        youtube_id: 'newVideoId',
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', {
        page_slug: 'servicios',
        title: 'New Title',
        subtitle: 'New Subtitle',
        youtube_id: 'newVideoId',
      });
      expect(result).toEqual(updatedHero);
    });

    it('should not include undefined values in patch', async () => {
      const ctx = createMockDbContext();
      const updatedHero = {
        _id: 'hero1',
        title: 'Only Title Updated',
        background_type: 'image',
        is_active: true,
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        title: 'Only Title Updated',
        subtitle: undefined,
      });

      // subtitle should not be in the patch because it's undefined
      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', {
        title: 'Only Title Updated',
      });
    });

    it('should update CTAs array', async () => {
      const ctx = createMockDbContext();
      const newCtas = [
        { text: 'New CTA 1', href: '/new1' },
        { text: 'New CTA 2', href: '/new2', variant: 'outline' },
      ];
      const updatedHero = { _id: 'hero1', ctas: newCtas };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      const result = await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        ctas: newCtas,
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', { ctas: newCtas });
      expect(result.ctas).toEqual(newCtas);
    });

    it('should update badges array', async () => {
      const ctx = createMockDbContext();
      const newBadges = [{ text: 'Updated Badge', icon: 'check' }];
      const updatedHero = { _id: 'hero1', badges: newBadges };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      const result = await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        badges: newBadges,
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', { badges: newBadges });
      expect(result.badges).toEqual(newBadges);
    });

    it('should update background_type to youtube', async () => {
      const ctx = createMockDbContext();
      const updatedHero = {
        _id: 'hero1',
        background_type: 'youtube',
        youtube_id: 'newVideo123',
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      const result = await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        background_type: 'youtube',
        youtube_id: 'newVideo123',
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', {
        background_type: 'youtube',
        youtube_id: 'newVideo123',
      });
      expect(result.background_type).toBe('youtube');
    });
  });

  describe('deleteHero mutation', () => {
    it('should delete hero by id', async () => {
      const ctx = createMockDbContext();
      ctx.db.delete.mockResolvedValue(undefined);

      const mutationCalls = mutation.mock.calls;
      const deleteHeroConfig = mutationCalls[2]?.[0];

      await deleteHeroConfig.handler(ctx, { id: 'hero1' });

      expect(ctx.db.delete).toHaveBeenCalledWith('hero1');
    });

    it('should call delete with correct hero id', async () => {
      const ctx = createMockDbContext();
      ctx.db.delete.mockResolvedValue(undefined);

      const mutationCalls = mutation.mock.calls;
      const deleteHeroConfig = mutationCalls[2]?.[0];

      await deleteHeroConfig.handler(ctx, { id: 'hero-to-delete' });

      expect(ctx.db.delete).toHaveBeenCalledWith('hero-to-delete');
    });
  });

  describe('page_slug association', () => {
    it('should create hero with page_slug for home page', async () => {
      const ctx = createMockDbContext();
      ctx.db.insert.mockResolvedValue('hero-home');

      const mutationCalls = mutation.mock.calls;
      const createHeroConfig = mutationCalls[0]?.[0];

      const heroData = {
        page_slug: 'home',
        title: 'Home Hero',
        background_type: 'image',
        image_url: 'https://example.com/home.jpg',
      };

      await createHeroConfig.handler(ctx, heroData);

      expect(ctx.db.insert).toHaveBeenCalledWith(
        'heroes',
        expect.objectContaining({
          page_slug: 'home',
        })
      );
    });

    it('should create hero with page_slug for servicios page', async () => {
      const ctx = createMockDbContext();
      ctx.db.insert.mockResolvedValue('hero-servicios');

      const mutationCalls = mutation.mock.calls;
      const createHeroConfig = mutationCalls[0]?.[0];

      const heroData = {
        page_slug: 'servicios',
        title: 'Services Hero',
        background_type: 'youtube',
        youtube_id: 'serviceVideo123',
      };

      await createHeroConfig.handler(ctx, heroData);

      expect(ctx.db.insert).toHaveBeenCalledWith(
        'heroes',
        expect.objectContaining({
          page_slug: 'servicios',
        })
      );
    });

    it('should allow updating page_slug', async () => {
      const ctx = createMockDbContext();
      const updatedHero = {
        _id: 'hero1',
        page_slug: 'new-page',
        title: 'Moved Hero',
      };
      ctx.db.patch.mockResolvedValue(undefined);
      ctx.db.get.mockResolvedValue(updatedHero);

      const mutationCalls = mutation.mock.calls;
      const updateHeroConfig = mutationCalls[1]?.[0];

      await updateHeroConfig.handler(ctx, {
        id: 'hero1',
        page_slug: 'new-page',
      });

      expect(ctx.db.patch).toHaveBeenCalledWith('hero1', {
        page_slug: 'new-page',
      });
    });
  });
});
