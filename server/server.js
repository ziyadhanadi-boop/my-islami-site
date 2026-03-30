const dns = require('dns'); // server-reload-trigger
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to bypass ISP blocking
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error('MongoDB Error:', err));

// Fallback for JWT secret if .env is missing
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'secret123';
}

// Define Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/zikr', require('./routes/zikr'));
app.use('/api/media', require('./routes/media'));
app.use('/api/hadith', require('./routes/hadith'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/books', require('./routes/books'));
app.use('/api/videosList', require('./routes/videosList'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/fatwaArchive', require('./routes/fatwaArchive'));
app.use('/api/kidContent', require('./routes/kidContent'));
app.use('/api/khatmah', require('./routes/khatmah'));
app.use('/api/events', require('./routes/events'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/duas', require('./routes/duas'));
app.use('/api/prophet-stories', require('./routes/prophetStories'));
app.use('/api/tibb', require('./routes/tibb'));
app.use('/api/podcasts', require('./routes/podcasts'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/daily-quotes', require('./routes/dailyQuotes'));

// Static Paths
const distPath = path.join(__dirname, '../client/dist');
const indexPath = path.join(distPath, 'index.html');

// Sitemap & Robots shortcuts
app.get('/sitemap.xml', (req, res) => res.redirect('/api/seo/sitemap.xml'));
app.get('/robots.txt', (req, res) => res.redirect('/api/seo/robots.txt'));

// Performance Cache (Advanced Redis-backed Manager)
const cache = require('./utils/cache');
let cachedIndexHTML = null;

// Helper to get Index HTML template (Cache it in memory)
const getIndexTemplate = () => {
  if (cachedIndexHTML) return cachedIndexHTML;
  if (fs.existsSync(indexPath)) {
    cachedIndexHTML = fs.readFileSync(indexPath, 'utf8');
    return cachedIndexHTML;
  }
  return `<!DOCTYPE html><html lang="ar" dir="rtl"><head><title>REPLACE_TITLE</title><meta charset="utf-8"></head><body><div id="root">REPLACE_BODY</div></body></html>`;
};

// SSR Article Rendering Logic (Enterprise Performance Stack)
const renderArticleSSR = async (req, res, next) => {
  const urlPath = req.path;
  if (urlPath.startsWith('/article/')) {
    const slug = urlPath.split('/article/')[1]?.split('?')[0];
    if (!slug) return next();

    // 1. Stale-While-Revalidate Strategy (Ultra Fast)
    const cachedHTML = await cache.get(`ssr_${slug}`);
    
    // Set modern CDN friendly headers (Cloudflare support)
    // public: cache on user and CDN
    // s-maxage: how long CDN stores it (1 year)
    // stale-while-revalidate: serve stale if within 24h of expiry
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400');

    if (cachedHTML) {
      res.set('X-Cache', 'HIT');
      return res.send(cachedHTML);
    }

    try {
      const Article = require('./models/Article');
      // 2. Optimized Lean Query
      const art = await Article.findOne({ slug })
        .select('title content category imageUrl createdAt slug')
        .lean();

      if (art) {
        let html = getIndexTemplate();
        const title = `${art.title} | منصة إسلامي`;
        const desc = art.content.slice(0, 160).replace(/<[^>]*>?/gm, '') + '...';
        const image = art.imageUrl ? `${req.protocol}://${req.get('host')}${art.imageUrl}` : '';
        
        const articleHtml = `
          <article style="max-width:800px; margin:0 auto; padding:2rem;">
            <h1>${art.title}</h1>
            <p><strong>التصنيف:</strong> ${art.category}</p>
            ${art.imageUrl ? `<img src="${image}" alt="${art.title}" style="max-width:100%;">` : ''}
            <div class="content">${art.content}</div>
          </article>
        `;

        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        const siteUrl = `${req.protocol}://${req.get('host')}`;
        const articleUrl = `${siteUrl}/article/${art.slug}`;
        const imageAbsolute = art.imageUrl
          ? (art.imageUrl.startsWith('http') ? art.imageUrl : `${siteUrl}${art.imageUrl}`)
          : `${siteUrl}/og-default.jpg`;
        
        const injection = `
          <!-- Primary SEO -->
          <meta name="description" content="${desc}">
          <link rel="canonical" href="${articleUrl}">
          
          <!-- Open Graph (Facebook / WhatsApp / Telegram) -->
          <meta property="og:type" content="article">
          <meta property="og:site_name" content="منصة إسلامي">
          <meta property="og:locale" content="ar_AR">
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${desc}">
          <meta property="og:image" content="${imageAbsolute}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:image:alt" content="${art.title}">
          <meta property="og:url" content="${articleUrl}">
          
          <!-- Twitter / X Card -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${desc}">
          <meta name="twitter:image" content="${imageAbsolute}">
          <meta name="twitter:image:alt" content="${art.title}">
          
          <!-- Article Specific -->
          <meta property="article:published_time" content="${new Date(art.createdAt).toISOString()}">
          <meta property="article:section" content="${art.category}">
          
          <!-- SSR Data for React Hydration -->
          <script id="ssr-data" type="application/json">${JSON.stringify(art)}</script>
          
          <!-- Schema.org JSON-LD -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${art.title}",
            "description": "${desc}",
            "image": "${imageAbsolute}",
            "url": "${articleUrl}",
            "author": { "@type": "Organization", "name": "منصة إسلامي" },
            "publisher": {
              "@type": "Organization",
              "name": "منصة إسلامي",
              "logo": { "@type": "ImageObject", "url": "${siteUrl}/logo.png" }
            },
            "datePublished": "${new Date(art.createdAt).toISOString()}",
            "inLanguage": "ar",
            "articleSection": "${art.category}"
          }
          </script>
        </head>`;

        html = html.replace('</head>', injection);
        if (html.includes('<div id="root"></div>')) {
          html = html.replace('<div id="root"></div>', `<div id="root">${articleHtml}</div>`);
        } else {
          html = html.replace('REPLACE_BODY', articleHtml);
        }

        // 3. Save to Global Redis Cache
        await cache.set(`ssr_${slug}`, html, 3600); // 1 hour expiry
        
        res.set('X-Cache', 'MISS');
        return res.send(html);
      }
    } catch (err) { console.error('SSR Error:', err); }
  }
  next();
};

// Static Serving (Priority 1: Files)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// SSR for Article Pages (Priority 2: Dynamic Articles for SEO)
app.get('/article/:slug', renderArticleSSR);

// SPA Fallback (Priority 3: The rest for React)
app.get('*', (req, res, next) => {
  // If it's an API route that reached here, don't serve index.html
  if (req.path.startsWith('/api')) return next();
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Server is running. Client build not found (SPA Fallback).');
  }
});

const PORT = process.env.PORT || 5000;

// Pre-render High-Traffic articles (Cache Warm-up Engine)
const warmUpCache = async () => {
    try {
        console.log('🔥 Server Warming-up: Pre-rendering popular articles...');
        const Article = require('./models/Article');
        const popularArticles = await Article.find({ isHidden: { $ne: true } })
            .sort({ views: -1 })
            .limit(10)
            .select('slug')
            .lean();
        
        for (const art of popularArticles) {
            const mockReq = { 
                path: `/article/${art.slug}`, 
                protocol: 'http', 
                get: (header) => header === 'host' ? 'localhost' : '' 
            };
            const mockRes = { 
                set: () => {}, 
                send: async (html) => { await cache.set(`ssr_${art.slug}`, html, 3600); } 
            };
            await renderArticleSSR(mockReq, mockRes, () => {});
        }
        console.log(`✅ Success: Cache warmed for ${popularArticles.length} articles.`);
    } catch (err) { console.warn('⚠️ Warm-up failed:', err.message); }
};

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await warmUpCache();
});
