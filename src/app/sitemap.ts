import { MetadataRoute } from 'next';
import { db } from '@/lib/db/store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://iotogether.edu');
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/receiver/explore`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/receiver/project-recipe`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/institutions`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamic equipment resource detail routes (36 catalog items)
  const resources = db.getResources();
  const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${baseUrl}/resources/${r.id}`,
    lastModified: new Date(r.updated_at || r.created_at || now),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Dynamic institution routes
  const institutions = db.getInstitutions();
  const institutionRoutes: MetadataRoute.Sitemap = institutions.map((inst) => ({
    url: `${baseUrl}/institutions#${inst.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...resourceRoutes, ...institutionRoutes];
}
