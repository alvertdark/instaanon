import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Pre-generate popular profile pages for SEO
  const popularProfiles = [
    'cristiano', 'selenagomez', 'leomessi', 'kyliejenner',
    'natgeo', 'nasa', 'instagram', 'beyonce', 'therock',
    'arianagrasde', 'taylorswift', 'neymarjr',
  ];

  const profilePages: MetadataRoute.Sitemap = popularProfiles.flatMap((username) => [
    {
      url: `${SITE_URL}/profile/${username}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/stories/${username}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/highlights/${username}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]);

  return [...staticPages, ...profilePages];
}
