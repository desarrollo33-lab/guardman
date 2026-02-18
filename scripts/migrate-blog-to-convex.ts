/**
 * Migration script: Blog posts from Astro Content Collection to Convex
 *
 * Usage: bun run scripts/migrate-blog-to-convex.ts
 *
 * This script:
 * 1. Reads all .md/.mdx files from src/content/blog/
 * 2. Parses frontmatter and content
 * 3. Converts to Convex blog_posts format
 * 4. Seeds data to Convex via HTTP API
 */

import { glob } from 'glob';
import { readFileSync } from 'fs';
import { join, basename } from 'path';

// Convex configuration
const CONVEX_URL = process.env.PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error('ERROR: PUBLIC_CONVEX_URL environment variable is required');
  process.exit(1);
}

// Frontmatter interface matching Astro schema
interface BlogFrontmatter {
  title: string;
  description: string;
  pubDate: string | Date;
  author: string;
  image?: string;
  tags: string[];
}

// Parsed blog post
interface ParsedPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

// Convex blog_posts content block
interface ContentBlock {
  type: string;
  content: string;
  alt?: string;
  caption?: string;
  items?: string[];
}

// Convex blog_post input
interface ConvexPostInput {
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
  is_published: boolean;
  content: ContentBlock[];
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): {
  frontmatter: BlogFrontmatter;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML parser for frontmatter
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterStr.split('\n');
  let currentKey = '';
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trimEnd();

    // Array item
    if (trimmedLine.startsWith('- ') && inArray) {
      const value = trimmedLine.slice(2).trim().replace(/['"]/g, '');
      arrayValues.push(value);
      continue;
    }

    // End of array
    if (
      inArray &&
      !trimmedLine.startsWith(' ') &&
      !trimmedLine.startsWith('-')
    ) {
      frontmatter[currentKey] = arrayValues;
      inArray = false;
      arrayValues = [];
    }

    // Key-value pair
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmedLine.slice(0, colonIndex).trim();
      let value = trimmedLine.slice(colonIndex + 1).trim();

      // Check if value starts array on next lines
      if (value === '' || value === '[') {
        currentKey = key;
        inArray = true;
        arrayValues = [];
        continue;
      }

      // Remove quotes
      value = value.replace(/^['"]|['"]$/g, '');

      // Handle inline arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        frontmatter[key] = arrayContent
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter((s) => s.length > 0);
        continue;
      }

      frontmatter[key] = value;
    }
  }

  // Handle trailing array
  if (inArray && arrayValues.length > 0) {
    frontmatter[currentKey] = arrayValues;
  }

  // Ensure tags is an array
  if (!Array.isArray(frontmatter.tags)) {
    frontmatter.tags = [];
  }

  return {
    frontmatter: frontmatter as unknown as BlogFrontmatter,
    body,
  };
}

/**
 * Calculate read time based on word count (200 words per minute)
 */
function calculateReadTime(content: string): number {
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Convert markdown content to Convex content blocks
 * For simplicity, we store the entire markdown as a single "markdown" block
 */
function convertToContentBlocks(body: string): ContentBlock[] {
  return [
    {
      type: 'markdown',
      content: body.trim(),
    },
  ];
}

/**
 * Parse a single blog post file
 */
function parseBlogPost(filePath: string): ParsedPost {
  const content = readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  // Generate slug from filename (remove extension)
  const fileName = basename(filePath);
  const slug = fileName.replace(/\.(md|mdx)$/, '');

  return {
    slug,
    frontmatter,
    content: body,
  };
}

/**
 * Convert parsed post to Convex input format
 */
function toConvexInput(post: ParsedPost): ConvexPostInput {
  const { frontmatter, content, slug } = post;

  // Parse pubDate to timestamp
  const pubDate = new Date(frontmatter.pubDate);
  const publishedAt = isNaN(pubDate.getTime()) ? Date.now() : pubDate.getTime();

  // Calculate read time
  const readTime = calculateReadTime(content);

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.description,
    cover_image: frontmatter.image || '',
    author: frontmatter.author,
    published_at: publishedAt,
    read_time: readTime,
    tags: frontmatter.tags || [],
    is_featured: false,
    is_published: true,
    content: convertToContentBlocks(content),
  };
}

/**
 * Call Convex mutation via HTTP API
 */
async function createPostInConvex(post: ConvexPostInput): Promise<string> {
  const response = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: 'blog_posts:createPost',
      args: post,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create post: ${error}`);
  }

  const result = await response.json();
  return result.value;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting blog migration to Convex...\n');

  // Find all blog posts
  const blogDir = join(process.cwd(), 'src', 'content', 'blog');
  const files = await glob('*.{md,mdx}', { cwd: blogDir });

  console.log(`📁 Found ${files.length} blog posts to migrate\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = join(blogDir, file);
    console.log(`Processing: ${file}`);

    try {
      // Parse the post
      const parsed = parseBlogPost(filePath);

      // Convert to Convex format
      const convexInput = toConvexInput(parsed);

      console.log(`  - Title: ${convexInput.title}`);
      console.log(`  - Slug: ${convexInput.slug}`);
      console.log(`  - Read time: ${convexInput.read_time} min`);
      console.log(`  - Tags: ${convexInput.tags.join(', ')}`);

      // Create in Convex
      const postId = await createPostInConvex(convexInput);
      console.log(`  ✅ Created with ID: ${postId}\n`);
      successCount++;
    } catch (error) {
      console.error(
        `  ❌ Error: ${error instanceof Error ? error.message : error}\n`
      );
      errorCount++;
    }
  }

  console.log('━'.repeat(50));
  console.log(`\n📊 Migration complete:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📄 Total: ${files.length}\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run migration
migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
