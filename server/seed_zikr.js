require('dns').setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Zikr = require('./models/Zikr');

dotenv.config();

const zikrs = [
  { text: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', count: 1, category: 'morning', description: 'يُقال مرة واحدة في الصباح' },
  { text: 'اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور', count: 1, category: 'morning', description: 'يُقال مرة واحدة في الصباح' },
  { text: 'سبحان الله وبحمده', count: 100, category: 'morning', description: 'يُقال مئة مرة لغفران الذنوب' },
  { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير', count: 10, category: 'morning', description: 'تعدل عتق أربع أنفس' },
  { text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم', count: 3, category: 'morning', description: 'لا يضره شيء حتى يمسي' },
  { text: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', count: 1, category: 'evening', description: 'يُقال مرة واحدة في المساء' },
  { text: 'اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير', count: 1, category: 'evening', description: 'يُقال مرة واحدة في المساء' },
  { text: 'أعوذ بكلمات الله التامات من شر ما خلق', count: 3, category: 'evening', description: 'لم تضره حمة تلك الليلة' },
  { text: 'أستغفر الله وأتوب إليه', count: 100, category: 'general', description: 'تطهر القلب وتجلب الرزق' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB...');
    await Zikr.deleteMany({}); // Optional: clear existing if you want a fresh start
    await Zikr.insertMany(zikrs);
    console.log('Zikrs seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding zikrs:', err);
    process.exit(1);
  });
