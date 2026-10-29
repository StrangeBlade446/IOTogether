import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://iotogether.edu');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/receiver/explore',
          '/receiver/project-recipe',
          '/institutions',
          '/resources/',
          '/privacy',
          '/contact',
          '/login',
          '/signup',
        ],
        disallow: [
          '/admin/',
          '/manage/',
          '/api/',
          '/profile',
          '/sender/requests/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
