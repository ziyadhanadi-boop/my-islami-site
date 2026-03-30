require('dns').setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Hadith = require('./models/Hadith');

dotenv.config();

const hadiths = [
  { text: "«من دل على خير فله مثل أجر فاعله»", source: "رواه مسلم" },
  { text: "«إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى»", source: "متفق عليه" },
  { text: "«خيركم من تعلم القرآن وعلمه»", source: "رواه البخاري" },
  { text: "«تبسمك في وجه أخيك لك صدقة»", source: "رواه الترمذي" },
  { text: "«المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف»", source: "رواه مسلم" },
  { text: "«لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه»", source: "رواه البخاري" },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB...');
    await Hadith.deleteMany({});
    await Hadith.insertMany(hadiths);
    console.log('Hadiths seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding hadiths:', err);
    process.exit(1);
  });
