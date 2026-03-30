const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// XML Sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const articles = await Article.find({ isHidden: { $ne: true } }).select('slug createdAt');
    const baseUrl = req.protocol + '://' + req.get('host');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const mainPages = ['', 'archive', 'messages', 'hadith', 'zikr', 'multimedia', 'fatwa', 'khatmah', 'kids', 'events', 'quiz', 'books'];
    mainPages.forEach(page => {
      xml += `  <url>\n    <loc>${baseUrl}/${page}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Dynamic articles
    articles.forEach(art => {
      xml += `  <url>\n    <loc>${baseUrl}/article/${art.slug}</loc>\n    <lastmod>${new Date(art.createdAt).toISOString().split('T')[0]}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: ${baseUrl}/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

module.exports = router;
