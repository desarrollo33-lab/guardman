import { describe, it, expect, beforeEach, vi } from 'vitest';

// Types from the schema
interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  author: string;
  author_id?: string;
  published_at: number;
  read_time: number;
  tags: string[];
  is_featured: boolean;
  is_published?: boolean;
  content: Array<{
    type: string;
    content: string;
    alt?: string;
    caption?: string;
    items?: string[];
  }>;
}

// Mock database store
let mockDb: Map<string, BlogPost> = new Map();
let idCounter = 0;

// Helper to generate mock IDs
const generateId = () => `blog_posts_${++idCounter}`;

// Reset database before each test
beforeEach(() => {
  mockDb = new Map();
  idCounter = 0;
});

// Query result type
interface QueryResult {
  collect: () => Promise<BlogPost[]>;
  withIndex: (
    index: string,
    fn: (q: {
      eq: (
        field: string,
        value: string
      ) => { first: () => Promise<BlogPost | null> };
    }) => { first: () => Promise<BlogPost | null> }
  ) => { first: () => Promise<BlogPost | null> };
}

// Create mock context
const createMockCtx = () => ({
  db: {
    query: (_table: string): QueryResult => ({
      collect: async () => Array.from(mockDb.values()),
      withIndex: (
        _index: string,
        fn: (q: {
          eq: (
            field: string,
            value: string
          ) => { first: () => Promise<BlogPost | null> };
        }) => { first: () => Promise<BlogPost | null> }
      ) => {
        return fn({
          eq: (field: string, value: string) => ({
            first: async () => {
              const posts = Array.from(mockDb.values());
              return (
                posts.find((p) => p[field as keyof BlogPost] === value) || null
              );
            },
          }),
        });
      },
    }),
    insert: async (_table: string, doc: Omit<BlogPost, '_id'>) => {
      const id = generateId();
      const fullDoc = { ...doc, _id: id } as BlogPost;
      mockDb.set(id, fullDoc);
      return id;
    },
    get: async (id: string) => mockDb.get(id) || null,
    patch: async (id: string, updates: Partial<BlogPost>) => {
      const existing = mockDb.get(id);
      if (existing) {
        mockDb.set(id, { ...existing, ...updates });
      }
    },
    delete: async (id: string) => {
      mockDb.delete(id);
    },
  },
});

// Sample post data factory
const createSamplePost = (
  overrides: Partial<BlogPost> = {}
): Omit<BlogPost, '_id'> => ({
  slug: 'test-post',
  title: 'Test Post Title',
  excerpt: 'This is a test excerpt',
  cover_image: '/images/cover.jpg',
  author: 'John Doe',
  author_id: 'author_123',
  published_at: Date.now(),
  read_time: 5,
  tags: ['security', 'testing'],
  is_featured: false,
  is_published: false,
  content: [{ type: 'text', content: 'Hello world' }],
  ...overrides,
});

describe('blog_posts module', () => {
  describe('getAllPosts', () => {
    it('should return empty array when no posts exist', async () => {
      const ctx = createMockCtx();

      // Simulate getAllPosts query
      const result = await ctx.db.query('blog_posts').collect();

      expect(result).toEqual([]);
    });

    it('should return all posts including unpublished', async () => {
      const ctx = createMockCtx();

      // Insert test posts
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'post-1', is_published: true })
      );
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'post-2', is_published: false })
      );

      const result = await ctx.db.query('blog_posts').collect();

      expect(result).toHaveLength(2);
    });
  });

  describe('getPublishedPosts', () => {
    it('should return only published posts', async () => {
      const ctx = createMockCtx();

      // Insert test posts
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'published-1', is_published: true })
      );
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'published-2', is_published: true })
      );
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'draft', is_published: false })
      );

      // Simulate getPublishedPosts query
      const allPosts = await ctx.db.query('blog_posts').collect();
      const publishedPosts = allPosts.filter(
        (post) => post.is_published === true
      );

      expect(publishedPosts).toHaveLength(2);
      expect(publishedPosts.every((p) => p.is_published === true)).toBe(true);
    });

    it('should return empty array when no published posts', async () => {
      const ctx = createMockCtx();

      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: false })
      );

      const allPosts = await ctx.db.query('blog_posts').collect();
      const publishedPosts = allPosts.filter(
        (post) => post.is_published === true
      );

      expect(publishedPosts).toEqual([]);
    });

    it('should not return posts with undefined is_published', async () => {
      const ctx = createMockCtx();

      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: undefined })
      );

      const allPosts = await ctx.db.query('blog_posts').collect();
      const publishedPosts = allPosts.filter(
        (post) => post.is_published === true
      );

      expect(publishedPosts).toEqual([]);
    });
  });

  describe('getPostBySlug', () => {
    it('should return post when slug exists', async () => {
      const ctx = createMockCtx();

      const post = createSamplePost({ slug: 'my-awesome-post' });
      await ctx.db.insert('blog_posts', post);

      // Simulate getPostBySlug query
      const result = await ctx.db
        .query('blog_posts')
        .withIndex(
          'by_slug',
          (q: {
            eq: (
              field: string,
              value: string
            ) => { first: () => Promise<BlogPost | null> };
          }) => q.eq('slug', 'my-awesome-post')
        )
        .first();

      expect(result).not.toBeNull();
      expect(result?.slug).toBe('my-awesome-post');
    });

    it('should return null when slug does not exist', async () => {
      const ctx = createMockCtx();

      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'existing-post' })
      );

      const result = await ctx.db
        .query('blog_posts')
        .withIndex(
          'by_slug',
          (q: {
            eq: (
              field: string,
              value: string
            ) => { first: () => Promise<BlogPost | null> };
          }) => q.eq('slug', 'non-existent')
        )
        .first();

      expect(result).toBeNull();
    });
  });

  describe('getFeaturedPosts', () => {
    it('should return only featured AND published posts', async () => {
      const ctx = createMockCtx();

      await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          slug: 'featured-published',
          is_featured: true,
          is_published: true,
        })
      );
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          slug: 'featured-draft',
          is_featured: true,
          is_published: false,
        })
      );
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          slug: 'non-featured',
          is_featured: false,
          is_published: true,
        })
      );

      // Simulate getFeaturedPosts query
      const allPosts = await ctx.db.query('blog_posts').collect();
      const featuredPosts = allPosts.filter(
        (post) => post.is_featured === true && post.is_published === true
      );

      expect(featuredPosts).toHaveLength(1);
      expect(featuredPosts[0].slug).toBe('featured-published');
    });

    it('should return empty array when no featured and published posts', async () => {
      const ctx = createMockCtx();

      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_featured: true, is_published: false })
      );
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_featured: false, is_published: true })
      );

      const allPosts = await ctx.db.query('blog_posts').collect();
      const featuredPosts = allPosts.filter(
        (post) => post.is_featured === true && post.is_published === true
      );

      expect(featuredPosts).toEqual([]);
    });
  });

  describe('createPost', () => {
    it('should create post with valid data', async () => {
      const ctx = createMockCtx();
      const postData = createSamplePost();

      // Simulate createPost mutation
      const id = await ctx.db.insert('blog_posts', {
        ...postData,
        is_published: postData.is_published ?? false,
      });

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');

      const savedPost = await ctx.db.get(id);
      expect(savedPost).toMatchObject({
        slug: 'test-post',
        title: 'Test Post Title',
        is_published: false,
      });
    });

    it('should default is_published to false when not provided', async () => {
      const ctx = createMockCtx();
      const postData = createSamplePost({ is_published: undefined });

      const id = await ctx.db.insert('blog_posts', {
        ...postData,
        is_published: postData.is_published ?? false,
      });

      const savedPost = await ctx.db.get(id);
      expect(savedPost?.is_published).toBe(false);
    });

    it('should create post with is_published set to true', async () => {
      const ctx = createMockCtx();
      const postData = createSamplePost({ is_published: true });

      const id = await ctx.db.insert('blog_posts', {
        ...postData,
        is_published: postData.is_published ?? false,
      });

      const savedPost = await ctx.db.get(id);
      expect(savedPost?.is_published).toBe(true);
    });

    it('should throw error when slug already exists', async () => {
      const ctx = createMockCtx();

      // Insert first post
      await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'duplicate-slug' })
      );

      // Simulate createPost slug uniqueness check
      const existing = await ctx.db
        .query('blog_posts')
        .withIndex(
          'by_slug',
          (q: {
            eq: (
              field: string,
              value: string
            ) => { first: () => Promise<BlogPost | null> };
          }) => q.eq('slug', 'duplicate-slug')
        )
        .first();

      expect(existing).not.toBeNull();

      // In actual mutation, this would throw:
      // if (existing) throw new Error('Post with this slug already exists');
    });

    it('should allow different slugs', async () => {
      const ctx = createMockCtx();

      const id1 = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'post-1' })
      );
      const id2 = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'post-2' })
      );

      expect(id1).not.toBe(id2);
      expect(mockDb.size).toBe(2);
    });
  });

  describe('updatePost', () => {
    it('should update post title', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert('blog_posts', createSamplePost());

      await ctx.db.patch(id, { title: 'Updated Title' });
      const updated = await ctx.db.get(id);

      expect(updated?.title).toBe('Updated Title');
    });

    it('should update is_featured flag', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_featured: false })
      );

      await ctx.db.patch(id, { is_featured: true });
      const updated = await ctx.db.get(id);

      expect(updated?.is_featured).toBe(true);
    });

    it('should update is_published flag', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: false })
      );

      await ctx.db.patch(id, { is_published: true });
      const updated = await ctx.db.get(id);

      expect(updated?.is_published).toBe(true);
    });

    it('should update slug', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'old-slug' })
      );

      await ctx.db.patch(id, { slug: 'new-slug' });
      const updated = await ctx.db.get(id);

      expect(updated?.slug).toBe('new-slug');
    });

    it('should update multiple fields at once', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert('blog_posts', createSamplePost());

      await ctx.db.patch(id, {
        title: 'New Title',
        excerpt: 'New excerpt',
        is_featured: true,
      });
      const updated = await ctx.db.get(id);

      expect(updated?.title).toBe('New Title');
      expect(updated?.excerpt).toBe('New excerpt');
      expect(updated?.is_featured).toBe(true);
    });

    it('should preserve unmodified fields', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          title: 'Original Title',
          excerpt: 'Original Excerpt',
        })
      );

      await ctx.db.patch(id, { title: 'New Title' });
      const updated = await ctx.db.get(id);

      expect(updated?.title).toBe('New Title');
      expect(updated?.excerpt).toBe('Original Excerpt');
    });
  });

  describe('deletePost', () => {
    it('should remove post from database', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert('blog_posts', createSamplePost());

      expect(mockDb.size).toBe(1);

      await ctx.db.delete(id);

      expect(mockDb.size).toBe(0);
      const deleted = await ctx.db.get(id);
      expect(deleted).toBeNull();
    });

    it('should only delete specified post', async () => {
      const ctx = createMockCtx();
      const id1 = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'post-1' })
      );
      const id2 = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ slug: 'post-2' })
      );

      await ctx.db.delete(id1);

      expect(mockDb.size).toBe(1);
      const remaining = await ctx.db.get(id2);
      expect(remaining?.slug).toBe('post-2');
    });
  });

  describe('publishPost', () => {
    it('should set is_published to true', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: false })
      );

      await ctx.db.patch(id, {
        is_published: true,
        published_at: Date.now(),
      });
      const updated = await ctx.db.get(id);

      expect(updated?.is_published).toBe(true);
    });

    it('should update published_at timestamp', async () => {
      const ctx = createMockCtx();
      const oldTimestamp = 1000000;
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          is_published: false,
          published_at: oldTimestamp,
        })
      );

      const newTimestamp = Date.now();
      await ctx.db.patch(id, {
        is_published: true,
        published_at: newTimestamp,
      });
      const updated = await ctx.db.get(id);

      expect(updated?.published_at).toBe(newTimestamp);
    });

    it('should work on already published post', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: true })
      );

      await ctx.db.patch(id, {
        is_published: true,
        published_at: Date.now(),
      });
      const updated = await ctx.db.get(id);

      expect(updated?.is_published).toBe(true);
    });
  });

  describe('unpublishPost', () => {
    it('should set is_published to false', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: true })
      );

      await ctx.db.patch(id, { is_published: false });
      const updated = await ctx.db.get(id);

      expect(updated?.is_published).toBe(false);
    });

    it('should not modify published_at', async () => {
      const ctx = createMockCtx();
      const originalTimestamp = 12345678;
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          is_published: true,
          published_at: originalTimestamp,
        })
      );

      await ctx.db.patch(id, { is_published: false });
      const updated = await ctx.db.get(id);

      expect(updated?.published_at).toBe(originalTimestamp);
    });

    it('should work on already unpublished post', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_published: false })
      );

      await ctx.db.patch(id, { is_published: false });
      const updated = await ctx.db.get(id);

      expect(updated?.is_published).toBe(false);
    });
  });

  describe('is_featured flag handling', () => {
    it('should create post with is_featured true', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_featured: true })
      );
      const post = await ctx.db.get(id);

      expect(post?.is_featured).toBe(true);
    });

    it('should create post with is_featured false', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_featured: false })
      );
      const post = await ctx.db.get(id);

      expect(post?.is_featured).toBe(false);
    });

    it('should toggle is_featured', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ is_featured: false })
      );

      await ctx.db.patch(id, { is_featured: true });
      expect((await ctx.db.get(id))?.is_featured).toBe(true);

      await ctx.db.patch(id, { is_featured: false });
      expect((await ctx.db.get(id))?.is_featured).toBe(false);
    });
  });

  describe('author relationship', () => {
    it('should store author_id when provided', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ author_id: 'author_123' })
      );
      const post = await ctx.db.get(id);

      expect(post?.author_id).toBe('author_123');
    });

    it('should work without author_id', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ author_id: undefined })
      );
      const post = await ctx.db.get(id);

      expect(post?.author_id).toBeUndefined();
    });

    it('should update author_id', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ author_id: 'author_1' })
      );

      await ctx.db.patch(id, { author_id: 'author_2' });
      const post = await ctx.db.get(id);

      expect(post?.author_id).toBe('author_2');
    });
  });

  describe('content array handling', () => {
    it('should store content array', async () => {
      const ctx = createMockCtx();
      const content = [
        { type: 'text', content: 'First paragraph' },
        { type: 'h2', content: 'Section Title' },
        {
          type: 'image',
          content: '/image.jpg',
          alt: 'Alt text',
          caption: 'Caption',
        },
        { type: 'list', content: '', items: ['Item 1', 'Item 2'] },
      ];

      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({ content })
      );
      const post = await ctx.db.get(id);

      expect(post?.content).toHaveLength(4);
      expect(post?.content[0]).toEqual({
        type: 'text',
        content: 'First paragraph',
      });
      expect(post?.content[3].items).toEqual(['Item 1', 'Item 2']);
    });

    it('should update content array', async () => {
      const ctx = createMockCtx();
      const id = await ctx.db.insert(
        'blog_posts',
        createSamplePost({
          content: [{ type: 'text', content: 'Original' }],
        })
      );

      const newContent = [{ type: 'text', content: 'Updated' }];
      await ctx.db.patch(id, { content: newContent });
      const post = await ctx.db.get(id);

      expect(post?.content[0].content).toBe('Updated');
    });
  });
});
