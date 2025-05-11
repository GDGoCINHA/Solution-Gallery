export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/projects',
                    '/projects/',
                    '/projects/*',
                ],
                disallow: [
                    '/admin/',
                    '/admin/login',
                    '/api/',
                    '/_next/',
                ],
                crawlDelay: 5,
            },
            {
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            },
            {
                userAgent: 'Google-Extended',
                disallow: ['/'],
            },
            {
                userAgent: 'anthropic-ai',
                disallow: ['/'],
            },
        ],
    sitemap: 'https://solution-gallery.inha.tech/sitemap.xml',
    host: 'https://solution-gallery.inha.tech',
  };
} 