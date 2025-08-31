import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const robotsTxt = `# Robots.txt for CoinBitClub MarketBot
# https://coinbitclub.com/robots.txt

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /temp/
Disallow: /*.json$
Disallow: /*?*utm_source=
Disallow: /*?*utm_medium=
Disallow: /*?*utm_campaign=
Disallow: /*?*fbclid=
Disallow: /*?*gclid=

# Allow specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Block unwanted bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemap location
Sitemap: https://coinbitclub.com/sitemap.xml

# Host directive (for Yandex)
Host: https://coinbitclub.com
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache por 24 horas
  res.status(200).send(robotsTxt);
}
