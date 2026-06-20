// lib/seo.ts
// SEO helper — generates dynamic metadata per page

export const SITE_NAME = 'InstaAnon';
export const SITE_URL = 'https://instaanon.vercel.app';
export const SITE_DESCRIPTION =
  'Ve perfiles de Instagram de forma anónima. Historias, publicaciones, seguidores y destacados sin que nadie lo sepa. 100% gratis.';

export function generateProfileMetadata(username: string) {
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9._]/g, '');
  return {
    title: `Ver perfil de @${cleanUsername} en Instagram anónimamente | ${SITE_NAME}`,
    description: `Ve el perfil de @${cleanUsername}: fotos, publicaciones, seguidores y bio sin que sepa que lo visitaste. Gratis y anónimo.`,
    keywords: [
      `ver perfil ${cleanUsername} instagram`,
      `${cleanUsername} instagram anonimo`,
      `ver instagram sin cuenta`,
      `insta viewer`,
    ],
    alternates: {
      canonical: `${SITE_URL}/profile/${cleanUsername}`,
    },
    openGraph: {
      title: `@${cleanUsername} — Perfil de Instagram Anónimo | ${SITE_NAME}`,
      description: `Ve el perfil completo de @${cleanUsername} en Instagram de forma anónima`,
      url: `${SITE_URL}/profile/${cleanUsername}`,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: `InstaAnon — Ver @${cleanUsername}` }],
      type: 'website',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `@${cleanUsername} — Instagram Anónimo | ${SITE_NAME}`,
      description: `Ve el perfil de @${cleanUsername} sin que lo sepa`,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function generateStoriesMetadata(username: string) {
  return {
    title: `Historias de @${username} anónimas — Ver sin que te vea | ${SITE_NAME}`,
    description: `Mira las historias de @${username} en Instagram de forma anónima. No aparecerás en la lista de vistos. Gratis.`,
    alternates: { canonical: `${SITE_URL}/stories/${username}` },
    openGraph: {
      title: `Historias de @${username} | ${SITE_NAME}`,
      description: `Ve las historias de @${username} sin aparecer en visto`,
      url: `${SITE_URL}/stories/${username}`,
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
      type: 'website' as const,
    },
  };
}

export function generateHighlightsMetadata(username: string) {
  return {
    title: `Destacados de @${username} Instagram — Sin cuenta | ${SITE_NAME}`,
    description: `Ve todos los destacados de @${username} en Instagram sin necesidad de cuenta. Acceso anónimo y gratuito.`,
    alternates: { canonical: `${SITE_URL}/highlights/${username}` },
  };
}

export function generateReelsMetadata(username: string) {
  return {
    title: `Reels de @${username} Instagram | ${SITE_NAME}`,
    description: `Mira y descarga los reels de @${username} de Instagram gratis y de forma anónima.`,
    alternates: { canonical: `${SITE_URL}/reels/${username}` },
  };
}

// JSON-LD Schemas
export function getWebAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '3241',
      bestRating: '5',
    },
  };
}

export function getFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cómo ver historias de Instagram sin que te vean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Con InstaAnon puedes ver cualquier historia de Instagram de forma anónima. Solo escribe el @username en el buscador y podrás ver sus historias sin aparecer en la lista de vistos. Es completamente gratis.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Es gratis ver perfiles de Instagram anónimamente?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, InstaAnon es completamente gratuito para todos los usuarios. La herramienta se mantiene gracias a la publicidad no intrusiva.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Puedo descargar fotos y videos de Instagram?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, puedes descargar fotos, videos, historias y reels de perfiles públicos de Instagram de forma gratuita con InstaAnon.',
        },
      },
      {
        '@type': 'Question',
        name: '¿InstaAnon puede ver perfiles privados de Instagram?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'InstaAnon solo muestra contenido de perfiles públicos de Instagram. El contenido de perfiles privados no es accesible por razones de privacidad.',
        },
      },
      {
        '@type': 'Question',
        name: '¿El dueño del perfil sabrá que lo vi?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. InstaAnon te permite ver perfiles, historias y publicaciones de Instagram de forma completamente anónima. El dueño del perfil no recibirá ninguna notificación.',
        },
      },
    ],
  };
}

export function getBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
