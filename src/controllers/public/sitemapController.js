const Article = require('../../models/Article');
const Category = require('../../models/Category');

exports.getSitemap = async (req, res) => {
  try {
    const [articles, categories] = await Promise.all([
      Article.find({ status: 'published' })
        .select('slug updatedAt')
        .sort({ publishedAt: -1 }),
      Category.find({ isActive: true })
        .select('slug updatedAt')
    ]);

    const baseUrl = process.env.SITE_URL || 'https://pahlaviforiran.com';
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Homepage
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';
    
    // Static pages
    const staticPages = [
      { url: '/history', priority: '0.9', changefreq: 'weekly' },
      { url: '/news', priority: '0.9', changefreq: 'daily' },
      { url: '/reza-pahlavi', priority: '0.9', changefreq: 'weekly' }
    ];
    
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    // Articles
    articles.forEach(article => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/article/${article.slug}</loc>\n`;
      xml += `    <lastmod>${article.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    // Categories
    categories.forEach(category => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/category/${category.slug}</loc>\n`;
      xml += `    <lastmod>${category.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
};

exports.getRobots = (req, res) => {
  const baseUrl = process.env.SITE_URL || 'https://pahlaviforiran.com';
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
};
