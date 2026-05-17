import { Helmet } from 'react-helmet-async';
import { buildSiteGraph } from '@/lib/seo';

/**
 * Emits site-wide WebSite + Organization JSON-LD via Helmet.
 *
 * Mounted once at the application root so every page carries the site graph.
 * Page-specific structured data (e.g. an Event on a detail page) is added
 * separately via SEOHead's `jsonLd` prop and will coexist with this script.
 */
export const SiteJsonLd = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(buildSiteGraph())}
    </script>
  </Helmet>
);
