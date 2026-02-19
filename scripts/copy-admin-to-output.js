/**
 * Copy admin build to Vercel output and convex generated to web/
 * This runs AFTER astro build completes
 */
import { cpSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '..');
const adminDist = resolve(projectRoot, 'admin/dist');
const vercelOutput = resolve(projectRoot, 'web/.vercel/output/static/admin');
const convexGenerated = resolve(projectRoot, 'convex/_generated');
const webConvex = resolve(projectRoot, 'web/convex/_generated');

// Copy convex _generated to web/convex/
console.log('Copying convex/_generated to web/convex/_generated...');
mkdirSync(webConvex, { recursive: true });
cpSync(convexGenerated, webConvex, { recursive: true });
console.log('✅ Convex generated copied');

// Build admin if needed
if (!existsSync(adminDist)) {
  console.log('Admin dist not found, building...');
  const { execSync } = require('child_process');
  execSync('npm run build', {
    cwd: resolve(projectRoot, 'admin'),
    stdio: 'inherit',
  });
}

// Copy admin to Vercel output
console.log('Copying admin to .vercel/output/static/admin...');
mkdirSync(vercelOutput, { recursive: true });
cpSync(adminDist, vercelOutput, { recursive: true });
console.log('✅ Admin copied to Vercel output');
