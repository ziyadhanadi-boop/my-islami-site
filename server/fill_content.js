const mongoose = require('mongoose');
const ProphetStory = require('./models/ProphetStory');
const Dua = require('./models/Dua');
const Tibb = require('./models/Tibb');
const Podcast = require('./models/Podcast');
const Article = require('./models/Article');
const Zikr = require('./models/Zikr');
const Hadith = require('./models/Hadith');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';

async function seedContent() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Prophet Stories
    if (await ProphetStory.countDocuments() === 0) {
      await ProphetStory.create({
        prophetName: 'محمد',
        emoji: '🌙',
        summary: 'رحلة المصطفى ﷺ من المولد حتى الرفيق الأعلى، قصة النبوة الخاتمة ورحمة للعالمين.',
        content: `<h3>بعثة النبي ﷺ</h3><p>بدأت رحلة النبوة في غار حراء حين نزل الوحي على رسول الله ﷺ بأول آيات القرآن <b>(اقرأ باسم ربك الذي خلق)</b>. كانت بداية فجر جديد للبشرية جمعاء.</p><blockquote>(قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي يُحْبِبْكُمُ اللَّهُ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ)</blockquote><p>أقام النبي ﷺ دولة الإسلام في المدينة المنورة على أسس العدل والإخاء والرحمة، وترك لنا ميراثاً عظيماً من الأخلاق والسنة المشرفة.</p>`,
      });
      console.log('Added Prophet Story: Muhammad');
    }

    // 2. Duas
    if (await Dua.countDocuments() === 0) {
      await Dua.create({
        title: 'دعاء الاستخارة',
        category: 'الاستخارة',
        arabicText: 'اللَّهُمَّ إنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ...',
        meaning: 'طلب الخيرة من الله في الأمور المباحة التي لا يدري العبد وجه الصواب فيها.',
        source: 'رواه البخاري',
        occasion: 'عند الحيرة في اتخاذ قرار أو الإقدام على أمر جديد.'
      });
      console.log('Added Dua: Istikhara');
    }

    // 3. Tibb Nabawi
    if (await Tibb.countDocuments() === 0) {
      await Tibb.create({
        name: 'الحبة السوداء',
        category: 'أعشاب',
        hadith: 'في الحبة السوداء شفاء من كل داء إلا السأم',
        hadithSource: 'صحيح البخاري ومسلم',
        benefits: ['تقوية جهاز المناعة', 'مضاد حيوي طبيعي للالتهابات', 'تحسين صحة الجهاز الهضمي'],
        scientificNote: 'أثبتت الدراسات الحديثة احتواء حبة البركة على مادة التيموكينون التي تعمل كمضاد قوي للأكسدة والالتهابات.',
        usage: 'طحن ملعقة صغيرة وخلطها مع العسل أو تناول زيتها بجرعات مقدرة.',
      });
      console.log('Added Tibb: Black Seed');
    }

    // 4. Podcasts
    if (await Podcast.countDocuments() === 0) {
      await Podcast.create({
        title: 'سلسلة بناء الشخصية الإسلامية',
        speaker: 'الشيخ عمر عبد الكافي',
        category: 'دروس وعبر',
        description: 'محاضرة قيمة تتناول أسس بناء المسلم المعاصر وكيفية التعامل مع تحديات العصر بتمسك وثقة.',
        audioUrl: 'https://archive.org/download/omar-abdelkafy-pod/example.mp3',
        duration: '45:30'
      });
      console.log('Added Podcast: Character Building');
    }

    // 5. Articles
    if (await Article.countDocuments() === 0) {
      await Article.create({
        title: 'أثر الصلاة في راحة النفس',
        category: 'فقه الصلاة',
        slug: 'prayer-peace-1',
        content: '<p>تعتبر الصلاة هي عماد الدين وقرة عين النبي ﷺ، وفيها يجد المسلم ملاذه من صخب الحياة وضغوطها...</p>',
        summary: 'كيف تتحول الصلاة من مجرد حركات ظاهرة إلى معراج للروح وطمأنينة للقلب المسلم.',
        tags: ['الصلاة', 'الراحة النفسية'],
        isHidden: false
      });
      console.log('Added Article: Prayer Peace');
    }

    // 6. Zikr
    if (await Zikr.countDocuments() === 0) {
      await Zikr.create({
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
        category: 'أذكار الصباح والمساء',
        count: 100,
        reward: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان.'
      });
      console.log('Added Zikr: Tasbih');
    }

    // 7. Hadith
    if (await Hadith.countDocuments() === 0) {
      await Hadith.create({
        text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى',
        source: 'رواه البخاري ومسلم'
      });
      console.log('Added Hadith: Intentions');
    }

    console.log('Finished seeding content! Everything has at least one item.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedContent();
