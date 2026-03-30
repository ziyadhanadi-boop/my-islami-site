const mongoose = require('mongoose');
const Zikr = require('./models/Zikr');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';

async function migrateAzkar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Azkar migration...');
    
    // Update all 'اذكار الصباح والمساء' to something default, maybe 'اذكار الصباح'? 
    // Actually, let's keep it safe. 
    // Most users add them as morning/evening separately now.
    
    // Example: If anyone used English 'morning' or 'evening'
    const res1 = await Zikr.updateMany({ category: 'morning' }, { $set: { category: 'اذكار الصباح' } });
    console.log(`Updated ${res1.modifiedCount} morning zikr`);
    
    const res2 = await Zikr.updateMany({ category: 'evening' }, { $set: { category: 'اذكار المساء' } });
    console.log(`Updated ${res2.modifiedCount} evening zikr`);
    
    const res3 = await Zikr.updateMany({ category: 'اذكار الصباح والمساء' }, { $set: { category: 'اذكار الصباح' } });
    console.log(`Converted ${res3.modifiedCount} combined zikr to 'اذكار الصباح' (Admin needs to check them)`);

    mongoose.connection.close();
  } catch (err) {
    console.error('Migration error:', err);
  }
}

migrateAzkar();
