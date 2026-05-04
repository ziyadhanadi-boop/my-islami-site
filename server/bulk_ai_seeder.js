const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Article = require('./models/Article');
require('dotenv').config();

const categories = [
  "فقه الصلاة", "فقه الزكاة", "فقه الصيام", "المعاملات المالية", 
  "علوم القرآن", "الحديث النبوي", "الهدي النبوي", "العقيدة والتوحيد", 
  "نماء وتزكية", "فضل الدعاء", "السيرة والتاريخ", "الأسرة والمجتمع", "فتاوى"
];

async function seedBulkAI() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!MONGO_URI || !apiKey) {
      console.error('Missing env vars');
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB...');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    for (const category of categories) {
      console.log(`\n⏳ Generating content for: ${category}...`);
      
      const prompt = `اكتب 2 مقالاً إسلامياً مختلفاً ومفصلاً في قسم "${category}".
      يجب أن يكون الرد بتنسيق JSON حصراً كأنه مصفوفة من المقالات:
      [
        {
          "title": "عنوان المقال",
          "content": "محتوى HTML احترافي (عناوين h3، فقرات p، قوائم)",
          "summary": "ملخص قصير جداً"
        }
      ]`;

      try {
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        const startIdx = text.indexOf('['), endIdx = text.lastIndexOf(']');
        const articles = JSON.parse(text.substring(startIdx, endIdx + 1));

        for (const artData of articles) {
          await Article.create({
            ...artData,
            category,
            author: 'المساعد الذكي',
            status: 'published',
            isFeatured: Math.random() > 0.8
          });
          console.log(`   ✅ Added: ${artData.title}`);
        }
      } catch (err) {
        console.error(`   ❌ Failed for ${category}:`, err.message);
      }
    }

    console.log('\n🚀 Bulk AI Seeding Completed!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

seedBulkAI();
