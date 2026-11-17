import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { solutions } from './src/data/solutions.js';
import { blogPosts } from './src/data/blogPosts.js';
import { legalDocs } from './src/data/legalDocs.js';

function seoFiles() {
  return {
    name: 'symmetric-code-seo-files',
    generateBundle() {
      const siteUrl = (process.env.VITE_SITE_URL || 'https://your-domain.com').replace(/\/+$/, '');
      const serviceSlugs = ['web-development', 'app-development', 'pos-custom-software', 'ai-solutions', 'business-automation'];
      const routes = [
        '/', '/services', ...serviceSlugs.map(slug => `/services/${slug}`),
        '/solutions', ...solutions.map(item => `/solutions/${item.slug}`),
        '/work', '/pricing', '/about', '/team/aaliyan', '/contact', '/insights',
        ...blogPosts.map(post => `/insights/${post.slug}`),
        ...legalDocs.map(doc => `/legal/${doc.slug}`),
      ];
      const urls = routes.map(path => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n` });
    },
  };
}

export default defineConfig({ plugins: [react(), seoFiles()] });
