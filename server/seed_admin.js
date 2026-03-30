require('dns').setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';
        await mongoose.connect(mongoURI);
        const adminEmail = 'ziyad@islami.com';
        const adminPassword = 'Ziyad@is1';

        const existingUser = await User.findOne({ email: adminEmail });
        if (existingUser) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newUser = new User({
            email: adminEmail,
            password: hashedPassword,
        });

        await newUser.save();
        console.log('Admin user created successfully: ziyad@islami.com');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
