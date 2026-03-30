const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function resetPass() {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/islami_db';
        await mongoose.connect(mongoURI);
        
        const email = 'ziyad@islami.com';
        const newPassword = 'Ziyad@is1'; // Back to the user's preferred password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        
        console.log(`Password reset for ${email} to: ${newPassword}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetPass();
