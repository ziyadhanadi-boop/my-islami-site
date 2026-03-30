const mongoose = require('mongoose');
const Article = require('./models/Article');
require('dotenv').config();

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0621-\u064A-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const updateSlugs = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const articles = await Article.find({ slug: { $exists: false } });
    console.log(`Found ${articles.length} articles without slugs`);

    for (const article of articles) {
      article.slug = createSlug(article.title);
      // Ensure unique slug
      let count = 1;
      let existing = await Article.findOne({ slug: article.slug, _id: { $ne: article._id } });
      while(existing) {
        article.slug = `${createSlug(article.title)}-${count}`;
        existing = await Article.findOne({ slug: article.slug, _id: { $ne: article._id } });
        count++;
      }
      await article.save();
      console.log(`Updated: ${article.title} -> ${article.slug}`);
    }

    console.log('All slugs updated successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateSlugs();
