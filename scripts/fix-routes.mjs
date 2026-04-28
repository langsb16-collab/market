import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const routesPath = join(distPath, '_routes.json');

// Create proper _routes.json
const routes = {
  version: 1,
  include: ['/api/*'],
  exclude: [
    '/admin-new.html',
    '/admin/*',
    '/static/*',
    '/index.html',
    '/*.js',
    '/*.css',
    '/*.png',
    '/*.jpg',
    '/*.svg',
    '/*.ico'
  ]
};

try {
  writeFileSync(routesPath, JSON.stringify(routes, null, 2));
  console.log('[routes] ✅ Generated _routes.json');
} catch (error) {
  console.error('[routes] ❌ Failed to generate _routes.json:', error);
  process.exit(1);
}
