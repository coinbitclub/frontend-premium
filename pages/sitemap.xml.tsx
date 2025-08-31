import { GetServerSideProps } from 'next';

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://coinbitclub.com';
  
  // Lista de páginas principais
  const staticPages = [
    '',
    '/home',
    '/planos-new',
    '/termos-new',
    '/privacidade',
    '/auth/login-new',
    '/auth/register-new',
    '/affiliate'
  ];

  // Gerar XML do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${staticPages
    .map((page) => {
      const url = `${baseUrl}${page}`;
      const priority = page === '' || page === '/home' ? '1.0' : '0.8';
      const changefreq = page === '' || page === '/home' ? 'daily' : 'weekly';
      
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
