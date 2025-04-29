// initAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model'); // Adjust path if needed

// 1️⃣ **Update your MongoDB URI here** (Use your actual database name)
const MONGO_URI = 'mongodb://localhost:27017/diseasedetect'; // Change this if using MongoDB Atlas

// 2️⃣ **Set the admin email and password**
const ADMIN_EMAIL = 'cocoadmin@gmail.com';
const ADMIN_PASSWORD = '123456'; // Change this to your desired password

// Function to initialize the admin user
const initAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log('✅ Connected to MongoDB');

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ isAdmin: true });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            // Hash the new password
            const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
        } else {
            console.log('Creating new admin user...');
            // Hash the password
            const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

            // Create a new admin user
            const newAdmin = new User({
                userName: 'Admin',
                email: ADMIN_EMAIL,
                password: hashedPassword,
                isAdmin: true,
                role: 'admin'
            });

            await newAdmin.save();
        }

        console.log('✅ Admin user initialized successfully!');

        // Disconnect from database
        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
        mongoose.disconnect();
    }
};

// Execute the function
initAdmin();
