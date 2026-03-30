const mongoose = require('mongoose');
const DailyQuote = require('./models/DailyQuote');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';

const initialQuotes = [
  { text: "قال تعالى: ﴿إِنَّ مَعَ العُسْرِ يُسْرًا﴾", category: "قرآن" },
  { text: "قال رسول الله ﷺ: «مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ»", category: "حديث" },
  { text: "لا تحزن إن الله معنا.", category: "إيمانيات" },
  { text: "قال تعالى: ﴿وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى﴾", category: "قرآن" },
  { text: "قال رسول الله ﷺ: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»", category: "حديث" },
  { text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور.", category: "أذكار" }
];

async function seedQuotes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding quotes...');
    
    // Clear old if needed (maybe user wants to start fresh)
    await DailyQuote.deleteMany({});
    
    await DailyQuote.insertMany(initialQuotes);
    console.log('Seeded initial quotes successfully!');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding quotes:', err);
  }
}

seedQuotes();
