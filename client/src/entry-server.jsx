import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { legalDocs } from './data/legalDocs.js';
import { blogPosts } from './data/blogPosts.js';
import { services } from './data/site.js';
import { solutions } from './data/solutions.js';

export const prerenderRoutes = [
  '/', '/services', ...services.map(service => `/services/${service.slug}`),
  '/solutions', ...solutions.map(solution => `/solutions/${solution.slug}`),
  '/work', '/pricing', '/about', '/team/aaliyan', '/contact', '/insights',
  ...blogPosts.map(post => `/insights/${post.slug}`),
  ...legalDocs.map(document => `/legal/${document.slug}`),
];

export function render(url) {
  const helmetContext = {};
  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App initialIntroActive={false} />
      </StaticRouter>
    </HelmetProvider>,
  );
  return { appHtml, helmet: helmetContext.helmet };
}
