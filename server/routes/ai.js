const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Global safety settings to allow religious and sensitive content discussion without AI filters blocking it incorrectly
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

router.post('/generate-article', auth, async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ msg: 'يرجى إدخال كلمة مفتاحية' });

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

    const prompt = `اكتب مقالاً إسلامياً احترافياً ومفصلاً حول موضوع "${keyword}" باللغة العربية.
    يجب أن يكون الرد بتنسيق JSON حصراً ويحتوي على المفاتيح التالية:
    {
      "title": "عنوان جذاب للمقال",
      "category": "اختر القسم المناسب حصراً من هذه القائمة: [فقه الصلاة، فقه الزكاة، فقه الصيام، المعاملات المالية، علوم القرآن، الحديث النبوي، الهدي النبوي، العقيدة والتوحيد، نماء وتزكية، فضل الدعاء، السيرة والتاريخ، الأسرة والمجتمع، فتاوى]",
      "tags": ["وسم1", "وسم2", "وسم3", "وسم4"],
      "content": "محتوى المقال بتنسيق HTML احترافي جداً يتبع هذا النمط الجمالي: 
        1. العناوين الجانبية تكون بوزم <h3> مع ستايل color: #0d9488.
        2. الفقرات تكون بوزم <p> مع تباعد أسطر مريح وترك مسافة جيدة بين الفقرة والتي تليها.
        3. القوائم والنقاط استبدلها برمز البريق (✦) بدلاً من النقاط العادية، مع جعل الكلمة المفتاحية في بداية النقطة عريضة (Bold) متبوعة بنقطتين. مثال: ✦ <b>الحديث الصحيح:</b> شرح الحديث...
        4. الآيات القرآنية والأحاديث اجعلها داخل وسم <blockquote style='border-right: 4px solid #0d9488; padding-right: 15px; font-style: italic; color: #4b5563;'>.
        5. تجنب استخدام الأرقام للقوائم، استخدم الرموز الجمالية مثل (✦)."
    }
    لا تضف أي نصوص مقدمة أو خاتمة خارج كود الـ JSON.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    try {
      res.json(JSON.parse(text));
    } catch {
      const startIdx = text.indexOf('{'), endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) res.json(JSON.parse(text.substring(startIdx, endIdx + 1)));
      else throw new Error('Invalid JSON from AI');
    }
  } catch (error) {
    console.error('Gemini Article Error:', error);
    res.status(500).json({ msg: `خطأ في توليد المقال: ${error.message}` });
  }
});

router.post('/suggest-topic', auth, async (req, res) => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
    const prompt = `أنت خبير في المحتوى الإسلامي، اقترح 5 عناوين لمقالات إسلامية جذابة ومعاصرة تهم المسلم اليوم (عقيدة، فقه، تزكية، سيرة، أخلاق).
    يجب أن يكون الرد بتنسيق JSON حصراً ويحتوي على المفتاح suggestions وهو عبارة عن مصفوفة من 5 عناصر:
    {
      "suggestions": ["عنوان 1", "عنوان 2", "عنوان 3", "عنوان 4", "عنوان 5"]
    }
    لا تضف أي نصوص مقدمة أو خاتمة خارج كود الـ JSON.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    try { res.json(JSON.parse(text)); } catch {
      const startIdx = text.indexOf('{'), endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) res.json(JSON.parse(text.substring(startIdx, endIdx + 1)));
      else throw new Error('Invalid JSON');
    }
  } catch (error) {
    res.status(500).json({ msg: 'فشل في الحصول على اقتراحات', error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ msg: 'يرجى إدخال سؤال' });
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

    const chatInput = `أنت خبير ومساعد إسلامي متمكن. أجب على الأسئلة الدينية والشرعية بدقة وأمانة علمية بناءً على القرآن والسنة.
    - قدم إجابات وافية ومفصلة.
    - اجب بلباقة وباللغة العربية الفصحى.
    - في المسائل الفقهية، اذكر الآراء المعتبرة إن وجدت.
    - تذكير: إذا كان السؤال يتطلب فتوى خاصة وحرجة جداً، انصح السائل أيضاً بمراجعة دار الإفتاء الرسمية لزيادة الطمأنينة.
    
    السؤال: ${prompt}`;

    const result = await model.generateContent(chatInput);
    const text = (await result.response).text();
    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ msg: 'فشل في الحصول على رد من الذكاء الاصطناعي' });
  }
});

router.post('/search-quran', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ msg: 'يرجى إدخال سؤال قرآني' });
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

    const prompt = `أنت خبير في علوم القرآن الكريم والبحث المتخصص. 
    الهدف: الرد على استفسار المستخدم بآيات من القرآن الكريم ذات صلة بموضوع البحث، مع ذكر التفسير الميسر.
    البحث المطلوب: "${query}"
    يجب أن يكون الرد بتنسيق JSON حصراً:
    {
      "explanation": "نص ميسر يشرح خلاصة وجود هذا الموضوع في القرآن",
      "verses": [
        {
          "text": "نص الآية الكريمة بالتشكيل",
          "surah": "اسم السورة",
          "number": "رقم الآية",
          "meaning": "تفسير ميسر جداً لهذه الآية"
        }
      ]
    }
    لا تضف أي نصوص خارج JSON. ابحث عن 3 آيات بالأكثر.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    try { res.json(JSON.parse(text)); } catch {
      const startIdx = text.indexOf('{'), endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) res.json(JSON.parse(text.substring(startIdx, endIdx + 1)));
      else throw new Error('Invalid JSON');
    }
  } catch (error) {
    console.error('Gemini Quran Search Error:', error);
    res.status(500).json({ msg: 'فشل في البحث القرآني' });
  }
});

router.post('/smart-search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ msg: 'يرجى إدخال سؤالك' });
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });

  try {
    const Article = require('../models/Article');
    const FatwaArchive = require('../models/FatwaArchive');

    const [articles, fatwas] = await Promise.all([
      Article.find({ isHidden: { $ne: true } }).select('title content category slug').lean(),
      FatwaArchive.find({ isHidden: { $ne: true } }).select('question answer category').lean()
    ]);

    const articlesContext = articles.slice(0, 15).map(a =>
      `[مقالة: "${a.title}" | القسم: ${a.category} | الرابط: /article/${a.slug}]\n${a.content.replace(/<[^>]*>/g, '').slice(0, 400)}`
    ).join('\n\n---\n\n');

    const fatwasContext = fatwas.slice(0, 10).map(f =>
      `[فتوى في: ${f.category}]\nالسؤال: ${f.question}\nالإجابة: ${f.answer.slice(0, 300)}`
    ).join('\n\n---\n\n');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });

    const prompt = `أنت مساعد بحث إسلامي ذكي لموقع "إسلامي". 
    لديك قاعدة المعرفة التالية من مقالات وفتاوى الموقع:
    === المقالات ===
    ${articlesContext}
    === الفتاوى ===
    ${fatwasContext}
    سؤال المستخدم: "${query}"

    مهمتك:
    1. ابحث في قاعدة المعرفة عن أقرب الإجابات.
    2. قدم إجابة مختصرة مفيدة (3-5 جمل).
    3. أذكر المصادر من الموقع.

    يجب أن يكون ردك بتنسيق JSON فقط:
    {
      "answer": "نص الإجابة",
      "sources": [{ "title": "عنوان المصدر", "link": "/article/slug", "type": "مقالة أو فتوى" }],
      "confidence": "عالي أو متوسط"
    }
    لا تضف أي نصوص خارج JSON.`;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    try { res.json(JSON.parse(text)); } catch {
      const s = text.indexOf('{'), e = text.lastIndexOf('}');
      if (s !== -1 && e !== -1) res.json(JSON.parse(text.substring(s, e + 1)));
      else res.json({ answer: text, sources: [], confidence: 'متوسط' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'فشل البحث الذكي' });
  }
});

router.post('/dua-generator', async (req, res) => {
  const { situation } = req.body;
  if (!situation) return res.status(400).json({ msg: 'يرجى وصف موقفك' });
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
    const prompt = `أنت عالم إسلامي متخصص في الأدعية المأثورة. 
    المستخدم يواجه هذا الموقف: "${situation}"
    مهمتك: اقترح 3 أدعية مأثورة من القرآن الكريم أو السنة النبوية تناسب هذا الموقف.
    يجب أن يكون ردك بتنسيق JSON فقط:
    {
      "duas": [
        {
          "arabicText": "نص الدعاء بالعربية",
          "meaning": "معنى الدعاء بشكل مبسط",
          "source": "المصدر (مثل: رواه البخاري، سورة البقرة آية...)",
          "occasion": "متى يقرأ هذا الدعاء"
        }
      ],
      "advice": "نصيحة إسلامية قصيرة تتعلق بالموقف"
    }
    لا تضف أي نصوص خارج JSON.`;
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    try { res.json(JSON.parse(text)); }
    catch { const s = text.indexOf('{'), e = text.lastIndexOf('}'); s !== -1 && endIdx !== -1 ? res.json(JSON.parse(text.substring(s, e + 1))) : res.status(500).json({ msg: 'خطأ' }); }
  } catch (err) { res.status(500).json({ msg: 'فشل في توليد الدعاء' }); }
});

router.post('/halal-check', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ msg: 'يرجى إدخال السؤال' });
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ msg: 'API Key not configured' });
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
    const prompt = `أنت خبير في الأحكام الشرعية والفقهية. قدم الحكم الشرعي للسؤال التالي بدقة بناءً على الأدلة المعتبرة.
    السؤال: "${question}"
    يجب أن يكون ردك بتنسيق JSON فقط:
    {
      "verdict": "حلال أو حرام أو مختلف فيه أو مكروه أو يحتاج تفصيل",
      "verdictColor": "green أو red أو orange أو yellow أو blue",
      "explanation": "شرح واضح ومبسط للحكم (3-4 جمل)",
      "evidence": "الدليل من القرآن أو السنة أو الإجماع",
      "conditions": "شروط أو قيود إن وجدت",
      "disclaimer": "تذكير: هذا للاستفادة العلمية والتعليمية"
    }
    لا تضف أي نصوص خارج JSON.`;
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    try { res.json(JSON.parse(text)); }
    catch { const s = text.indexOf('{'), e = text.lastIndexOf('}'); s !== -1 && e !== -1 ? res.json(JSON.parse(text.substring(s, e + 1))) : res.status(500).json({ msg: 'خطأ' }); }
  } catch (err) { res.status(500).json({ msg: 'فشل في الاستفسار' }); }
});

module.exports = router;
