/**
 * Centralized SEO constants and helpers.
 *
 * NOTE on SITE_URL: the production hostname for this project hasn't been
 * confirmed yet — this is a best-guess default based on the repo slug. Override
 * via VITE_SITE_URL at build time (e.g. `VITE_SITE_URL=https://eventhub.app vite build`)
 * once the real domain is wired up.
 */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://event-platform-website.app';

export const SITE_NAME = 'EventHub';
export const SITE_DESCRIPTION =
  'Create, discover, and manage events with an intuitive, full-stack event management platform.';
export const SITE_LOCALE = 'en_US';
export const DEFAULT_SOCIAL_IMAGE = '/social-preview.svg';

/** Build an absolute URL from a relative path (`/event/abc` → `https://…/event/abc`). */
export const buildCanonicalUrl = (path?: string): string => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

/** Build an absolute image URL; passes through absolute URLs unchanged. */
export const buildAbsoluteImageUrl = (image?: string): string => {
  if (!image) return `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;
};

/**
 * Site-wide structured data (WebSite + Organization).
 * Returns a single @graph object meant for one application/ld+json script.
 */
export const buildSiteGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`,
      },
    },
  ],
});

interface EventForJsonLd {
  id: string;
  title: string;
  description: string;
  address?: string;
  target_date: string;
  background_image_url?: string;
  creator?: string;
}

/**
 * Build a Schema.org Event JSON-LD object suitable for Google's Event rich results.
 * Falls back gracefully when optional fields (location, image) are missing.
 */
export const buildEventJsonLd = (event: EventForJsonLd) => {
  const eventUrl = `${SITE_URL}/event/${event.id}`;
  const startDate = (() => {
    const d = new Date(event.target_date);
    return Number.isNaN(d.getTime()) ? event.target_date : d.toISOString();
  })();

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description?.slice(0, 5000) || SITE_DESCRIPTION,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: eventUrl,
  };

  if (event.background_image_url) {
    jsonLd.image = [buildAbsoluteImageUrl(event.background_image_url)];
  }

  if (event.address) {
    jsonLd.location = {
      '@type': 'Place',
      name: event.address,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
      },
    };
  }

  if (event.creator) {
    jsonLd.organizer = {
      '@type': 'Person',
      name: event.creator,
    };
  }

  // Required by Google for the Events rich result: an offers object even
  // when registration is free, so listings remain eligible for surfacing.
  jsonLd.offers = {
    '@type': 'Offer',
    url: eventUrl,
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: new Date().toISOString(),
  };

  return jsonLd;
};
