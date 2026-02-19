/**
 * Copy admin build to web/dist/admin/
 * This allows serving the admin SPA from /admin/* in Vercel
 */
import { cpSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const __dirname = resolve();
const adminDist = resolve(__dirname, '../admin/dist');
const webDist = resolve(__dirname, '../web/dist/admin');

// Check if admin dist exists
if (!existsSync(adminDist)) {
  console.log('Admin dist not found, building...');
  // Build admin first
  const { execSync } = require('child_process');
  execSync('npm run build', {
    cwd: resolve(__dirname, '../admin'),
    stdio: 'inherit',
  });
}

// Create target directory
mkdirSync(webDist, { recursive: true });

// Copy admin dist to web/dist/admin
cpSync(adminDist, webDist, { recursive: true });

console.log('✅ Admin copied to web/dist/admin/');
