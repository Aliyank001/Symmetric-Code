import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '', image = '/images/symmetric-code-logo-transparent.png', faqItems = [], serviceData = null, articleData = null, noindex = false }) {
  const fullTitle = title ? `${title} | Symmetric Code` : 'Symmetric Code — Software built around your business';
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech').replace(/\/+$/, '');
  const canonical = `${siteUrl}${path}`;
  const shareImage = new URL(image, `${siteUrl}/`).href;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Symmetric Code',
    email: 'symmetriccode01@gmail.com',
    telephone: '+923083504631',
    url: import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech',
    logo: `${(import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech').replace(/\/+$/, '')}/images/symmetric-code-mark.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Sindh',
      addressCountry: 'PK',
    },
    areaServed: ['Pakistan', 'United States', 'United Arab Emirates', 'United Kingdom', 'Qatar', 'Saudi Arabia', 'Oman'],
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Symmetric Code',
    url: import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech',
    publisher: { '@type': 'Organization', name: 'Symmetric Code' },
  };
  const faqSchema = faqItems.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  } : null;
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech' }];
  segments.forEach((segment, index) => breadcrumbs.push({
    name: index === segments.length - 1 && title ? title : decodeURIComponent(segment).replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
    url: `${import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech'}/${segments.slice(0, index + 1).join('/')}`,
  }));
  const breadcrumbSchema = breadcrumbs.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  } : null;
  const serviceSchema = serviceData ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceData.title,
    description: serviceData.detail || serviceData.description || serviceData.intro,
    provider: { '@type': 'Organization', name: 'Symmetric Code', url: import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech' },
    url: canonical,
  } : null;
  const articleSchema = articleData ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title,
    description: articleData.description,
    datePublished: articleData.date,
    author: { '@type': 'Organization', name: 'Symmetric Code' },
    publisher: { '@type': 'Organization', name: 'Symmetric Code', url: import.meta.env.VITE_SITE_URL || 'https://symmetriccode.tech' },
    mainEntityOfPage: canonical,
  } : null;
  return <Helmet>
    <title>{fullTitle}</title><meta name="description" content={description || 'Websites, apps, POS systems and automation for growing businesses.'} /><meta name="robots" content={noindex ? 'noindex,follow' : 'index,follow'} />
    <link rel="canonical" href={canonical} /><meta property="og:site_name" content="Symmetric Code" /><meta property="og:locale" content="en_US" /><meta property="og:title" content={fullTitle} /><meta property="og:description" content={description || 'Software built around your business.'} /><meta property="og:type" content={articleData ? 'article' : 'website'} /><meta property="og:url" content={canonical} /><meta property="og:image" content={shareImage} /><meta property="og:image:alt" content="Symmetric Code — software built around your business" />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={fullTitle} /><meta name="twitter:description" content={description || 'Software built around your business.'} /><meta name="twitter:image" content={shareImage} />
    <script type="application/ld+json">{JSON.stringify(org)}</script>
    {path === '' && <script type="application/ld+json">{JSON.stringify(website)}</script>}
    {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
    {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
    {serviceSchema && <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>}
    {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
  </Helmet>;
}
