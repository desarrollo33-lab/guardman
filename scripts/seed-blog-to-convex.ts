/**
 * Seed script: Push blog posts to Convex
 *
 * Usage: bun run scripts/seed-blog-to-convex.ts
 *
 * Prerequisites:
 * - Run migrate-blog-to-convex.ts first to generate the data
 * - Set PUBLIC_CONVEX_URL environment variable
 */

import { ConvexHttpClient } from 'convex/browser';
import { readFileSync } from 'fs';
import { join } from 'path';

const CONVEX_URL = process.env.PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error('ERROR: PUBLIC_CONVEX_URL environment variable is required');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

interface ContentBlock {
  type: string;
  content: string;
  alt?: string;
  caption?: string;
  items?: string[];
}

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

async function seed() {
  console.log('🌱 Seeding blog posts to Convex...\n');

  // Read the generated data
  const dataPath = join(process.cwd(), 'scripts', 'blog-posts-data.json');
  let posts: ConvexPostInput[];

  try {
    const data = readFileSync(dataPath, 'utf-8');
    posts = JSON.parse(data);
  } catch {
    console.error('❌ Could not read blog-posts-data.json');
    console.error('   Run migrate-blog-to-convex.ts first');
    process.exit(1);
  }

  console.log(`📁 Found ${posts.length} posts to seed\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    try {
      console.log(`Seeding: ${post.title}`);

      // Use mutation directly via HTTP client
      const result = await client.mutation(
        'blog_posts:createPost' as any,
        post as any
      );

      console.log(`  ✅ Created with ID: ${result}\n`);
      successCount++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Error: ${message}\n`);
      errorCount++;
    }
  }

  console.log('━'.repeat(50));
  console.log(`\n📊 Seeding complete:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📄 Total: ${posts.length}\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
