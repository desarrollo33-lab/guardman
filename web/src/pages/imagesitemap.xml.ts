import type { APIRoute } from 'astro';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

const convexUrl = import.meta.env.PUBLIC_CONVEX_URL || '';
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const baseUrl = 'https://guardman.cl';

interface ImageEntry {
  loc: string;
  title?: string;
  caption?: string;
}

export const GET: APIRoute = async () => {
  const images: ImageEntry[] = [];

  try {
    if (convex) {
      // Fetch services
      const services = await convex.query(api.services.getAllServices);
      if (services) {
        for (const service of services) {
          if (service.image) {
            images.push({
              loc: service.image,
              title: service.title,
              caption: service.image_alt || service.description,
            });
          }
        }
      }

      // Fetch solutions
      const solutions = await convex.query(api.solutions.getAllSolutions);
      if (solutions) {
        for (const solution of solutions) {
          if (solution.image) {
            images.push({
              loc: solution.image,
              title: solution.title,
              caption: solution.image_alt || solution.description,
            });
          }
        }
      }

      // Fetch blog posts (cover images)
      const blogPosts = await convex.query(api.blog_posts.getPublishedPosts);
      if (blogPosts) {
        for (const post of blogPosts) {
          if (post.cover_image) {
            images.push({
              loc: post.cover_image,
              title: post.title,
              caption: post.excerpt,
            });
          }
          // Also fetch images from blog post content
          if (post.content) {
            for (const block of post.content) {
              if (block.type === 'image' && block.content) {
                images.push({
                  loc: block.content,
                  title: post.title,
                  caption: block.caption || block.alt,
                });
              }
            }
          }
        }
      }

      // Fetch heroes
      const heroes = await convex.query(api.heroes.getAllHeroes);
      if (heroes) {
        for (const hero of heroes) {
          if (hero.image_url) {
            images.push({
              loc: hero.image_url,
              title: hero.title,
              caption: hero.subtitle,
            });
          }
          if (hero.mobile_image_url) {
            images.push({
              loc: hero.mobile_image_url,
              title: hero.title,
              caption: `${hero.title} (mobile)`,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching image sitemap data from Convex:', error);
  }

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images
  .map(
    (img) => `  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${escapeXml(img.title || '')}</image:title>
      <image:caption>${escapeXml(img.caption || '')}</image:caption>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
