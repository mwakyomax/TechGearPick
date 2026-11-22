import { useEffect } from 'react';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function setMetaTag(selector: string, attribute: string, value: string, content: string) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function usePageSeo({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  jsonLd,
}: SeoConfig) {
  useEffect(() => {
    const fullTitle = title.includes('TechGear Picks') ? title : `${title} | TechGear Picks`;
    document.title = fullTitle;

    const origin = window.location.origin;
    const currentUrl = canonicalPath ? `${origin}${canonicalPath}` : `${origin}${window.location.pathname}`;

    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    const existingScript = document.getElementById('techgear-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'techgear-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const cleanupScript = document.getElementById('techgear-jsonld');
      if (cleanupScript) cleanupScript.remove();
    };
  }, [title, description, canonicalPath, ogType, jsonLd]);
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}
