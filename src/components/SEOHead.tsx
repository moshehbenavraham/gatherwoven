import { Helmet } from 'react-helmet-async';
import {
  SITE_NAME,
  SITE_LOCALE,
  buildAbsoluteImageUrl,
  buildCanonicalUrl,
} from '@/lib/seo';

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

interface SEOHeadProps {
  title: string;
  description: string;
  /**
   * Optional comma-separated keywords. Most modern search engines ignore the
   * keywords meta tag, but we keep emitting it for callers that still rely on
   * it (e.g. niche search engines and on-site search tooling).
   */
  keywords?: string;
  /** Relative or absolute image URL. Relative paths are joined to SITE_URL. */
  image?: string;
  /**
   * Page path (e.g. `/event/abc`). Used to build absolute canonical/og:url.
   * Defaults to the browser's current pathname.
   */
  path?: string;
  /** When true, emit robots:noindex,nofollow (for auth/admin/404 pages). */
  noindex?: boolean;
  /** OpenGraph type. Defaults to `website`. */
  ogType?: 'website' | 'article' | 'profile';
  /** OpenGraph locale. Defaults to en_US. */
  locale?: string;
  /** One or more JSON-LD objects to embed as application/ld+json scripts. */
  jsonLd?: JsonLdValue;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  image,
  path,
  noindex = false,
  ogType = 'website',
  locale = SITE_LOCALE,
  jsonLd,
}: SEOHeadProps) => {
  // Avoid the "EventHub | EventHub" duplication when a page already uses the
  // brand as its title (e.g. landing page).
  const fullTitle =
    title === SITE_NAME || title.endsWith(`| ${SITE_NAME}`)
      ? title
      : `${title} | ${SITE_NAME}`;

  const resolvedPath =
    path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonicalUrl = buildCanonicalUrl(resolvedPath);
  const absoluteImage = buildAbsoluteImageUrl(image);

  const jsonLdNodes: Array<Record<string, unknown>> = Array.isArray(jsonLd)
    ? jsonLd
    : jsonLd
      ? [jsonLd]
      : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Structured data */}
      {jsonLdNodes.map((node, idx) => (
        <script
          key={`jsonld-${idx}`}
          type="application/ld+json"
        >
          {JSON.stringify(node)}
        </script>
      ))}
    </Helmet>
  );
};
