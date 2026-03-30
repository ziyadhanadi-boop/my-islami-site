const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';
        await mongoose.connect(mongoURI);
        const users = await User.find({});
        console.log('Users found:', users.length);
        if (users.length > 0) {
            users.forEach(u => console.log('Email:', u.email));
        } else {
            console.log('No users in DB');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
