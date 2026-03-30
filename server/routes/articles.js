const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');
const convertToWebP = require('../middleware/convertToWebP');

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper to create Arabic/SEO slug
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\u0621-\u064A-]+/g, '') // Remove non-word characters (keep Arabic)
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
};

// GET all articles (Public/Admin)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    console.log('Sending articles count:', articles.length);
    res.json(articles);
  } catch (err) {
    console.error('API GET ALL ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

// GET search articles (Public)
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const regex = new RegExp(q, 'i');
    const articles = await Article.find({
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } }
      ]
    }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET most read articles (Public)
router.get('/most-read', async (req, res) => {
  try {
    const articles = await Article.find({})
      .sort({ views: -1 })
      .limit(5);
    res.json(articles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET article by slug (Public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ msg: 'المقال غير موجود' });
    res.json(article);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET article by id (Public)
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST increment views (Public)
router.post('/:id/view', async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST rate article (Public)
router.post('/:id/rate', async (req, res) => {
  try {
    const { stars } = req.body;
    if (!stars || stars < 1 || stars > 5) return res.status(400).json({ msg: 'تقييم غير صالح' });
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { ratingSum: stars, ratingCount: 1 } },
      { new: true }
    );
    res.json({ avg: article.ratingCount ? (article.ratingSum / article.ratingCount).toFixed(1) : 0, count: article.ratingCount });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});



// POST new article (Protected)
router.post('/', auth, upload.single('image'), convertToWebP, async (req, res) => {
  try {
    const { title, content, category, tags, isFeatured, isHidden } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (err) {
        // Fallback for non-JSON strings or malformed data
        parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];
      }
    }

    const newArticle = new Article({
      title,
      content,
      category,
      imageUrl,
      tags: parsedTags,
      slug: createSlug(title),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      featuredPosition: parseInt(req.body.featuredPosition) || 0,
      isHidden: isHidden === 'true' || isHidden === true
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error('SERVER POST ERROR:', err.message);
    res.status(500).json({ msg: 'فشل في حفظ المقال في السيرفر', error: err.message });
  }
});

// PUT toggle visibility (Protected)
router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    article.isHidden = !article.isHidden;
    await article.save();
    
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT toggle featured (Protected)
router.put('/:id/toggle-featured', auth, async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    article.isFeatured = !article.isFeatured;
    if (!article.isFeatured) article.featuredPosition = 0;
    
    await article.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update featured position (Protected)
router.put('/:id/featured-position', auth, async (req, res) => {
  try {
    const { position } = req.body;
    let article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: { featuredPosition: parseInt(position) || 0, isFeatured: true } },
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT update article (Protected)
router.put('/:id', auth, upload.single('image'), convertToWebP, async (req, res) => {
  try {
    const { title, content, category, tags, isFeatured, isHidden } = req.body;
    
    let articleFields = {};
    if (title) articleFields.title = title;
    if (content) articleFields.content = content;
    if (category) articleFields.category = category;
    
    if (tags !== undefined) {
      articleFields.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }
    if (isFeatured !== undefined) {
      articleFields.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (req.body.featuredPosition !== undefined) {
      articleFields.featuredPosition = parseInt(req.body.featuredPosition) || 0;
    }
    if (isHidden !== undefined) {
      articleFields.isHidden = isHidden === 'true' || isHidden === true;
    }

    if (req.body.shouldDeleteImage === 'true') {
      articleFields.imageUrl = '';
    }

    if (req.file) {
      articleFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (title) {
        articleFields.slug = createSlug(title);
    }

    let article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    // Invalidate OLD slug cache
    await cache.delete(`ssr_${article.slug}`);

    article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: articleFields },
      { new: true }
    );

    // Invalidate NEW slug cache (if changed)
    await cache.delete(`ssr_${article.slug}`);

    res.json(article);
  } catch (err) {
    console.error('SERVER PUT ERROR:', err.message);
    res.status(500).json({ msg: 'فشل في تحديث المقال في السيرفر', error: err.message });
  }
});

// DELETE article (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Article not found' });

    // Invalidate Cache after deletion
    await cache.delete(`ssr_${article.slug}`);

    await Article.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET check duplicate title (Protected)
router.get('/check-duplicate', auth, async (req, res) => {
  try {
    const { title, excludeId } = req.query;
    if (!title) return res.json({ exists: false });
    
    const query = { title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } };
    if (excludeId) query._id = { $ne: excludeId };
    
    const duplicate = await Article.findOne(query);
    res.json({ exists: !!duplicate });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
