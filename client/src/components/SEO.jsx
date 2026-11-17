import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path = '', faqItems = [], serviceData = null, articleData = null }) {
  const fullTitle = title ? `${title} | Symmetric Code` : 'Symmetric Code — Software built around your business';
  const canonical = `${import.meta.env.VITE_SITE_URL || 'https://your-domain.com'}${path}`;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Symmetric Code',
    email: 'symmetriccode01@gmail.com',
    telephone: '+923083504631',
    url: import.meta.env.VITE_SITE_URL || 'https://your-domain.com',
  };
  const faqSchema = faqItems.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  } : null;
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: import.meta.env.VITE_SITE_URL || 'https://your-domain.com' }];
  segments.forEach((segment, index) => breadcrumbs.push({
    name: index === segments.length - 1 && title ? title : decodeURIComponent(segment).replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
    url: `${import.meta.env.VITE_SITE_URL || 'https://your-domain.com'}/${segments.slice(0, index + 1).join('/')}`,
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
    provider: { '@type': 'Organization', name: 'Symmetric Code', url: import.meta.env.VITE_SITE_URL || 'https://your-domain.com' },
    url: canonical,
  } : null;
  const articleSchema = articleData ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title,
    description: articleData.description,
    datePublished: articleData.date,
    author: { '@type': 'Organization', name: 'Symmetric Code' },
    publisher: { '@type': 'Organization', name: 'Symmetric Code', url: import.meta.env.VITE_SITE_URL || 'https://your-domain.com' },
    mainEntityOfPage: canonical,
  } : null;
  return <Helmet>
    <title>{fullTitle}</title><meta name="description" content={description || 'Websites, apps, POS systems and automation for growing businesses.'} />
    <link rel="canonical" href={canonical} /><meta property="og:title" content={fullTitle} /><meta property="og:description" content={description || 'Software built around your business.'} /><meta property="og:type" content="website" /><meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">{JSON.stringify(org)}</script>
    {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
    {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
    {serviceSchema && <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>}
    {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
  </Helmet>;
}
