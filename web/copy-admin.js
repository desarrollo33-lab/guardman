/**
 * Copy admin build to Vercel output
 * This runs AFTER astro build completes
 */
import { cpSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const webDir = __dirname;
const projectRoot = resolve(webDir, '..');
const adminDist = resolve(projectRoot, 'admin/dist');
const vercelOutput = resolve(webDir, '.vercel/output/static/admin');
const convexGenerated = resolve(projectRoot, 'convex/_generated');
const webConvex = resolve(webDir, 'convex/_generated');

// Copy convex _generated to web/convex/ (only if source exists - for local dev)
if (existsSync(convexGenerated)) {
  console.log('Copying convex/_generated...');
  mkdirSync(webConvex, { recursive: true });
  cpSync(convexGenerated, webConvex, { recursive: true });
  console.log('✅ Convex generated copied');
} else {
  console.log('Using existing web/convex/_generated');
}

// Build admin if needed (only if admin folder exists)
if (existsSync(resolve(projectRoot, 'admin'))) {
  if (!existsSync(adminDist)) {
    console.log('Admin dist not found, building...');
    const { execSync } = require('child_process');
    try {
      execSync('npm run build', {
        cwd: resolve(projectRoot, 'admin'),
        stdio: 'inherit',
      });
    } catch {
      console.log('Could not build admin, skipping...');
    }
  }

  if (existsSync(adminDist)) {
    // Copy admin to Vercel output
    console.log('Copying admin to .vercel/output/static/admin...');
    mkdirSync(vercelOutput, { recursive: true });
    cpSync(adminDist, vercelOutput, { recursive: true });
    console.log('✅ Admin copied to Vercel output');
  }
} else {
  console.log('Admin folder not found, skipping admin copy');
}
