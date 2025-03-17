require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const userModel = require('./models/userAuthModel'); // Ensure the correct path
const CryptoJS = require('crypto-js');

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('✅ Connected to MongoDB');

    try {
        const existingAdmin = await userModel.findOne({ email: process.env.ADMIN_EMAIL });

        if (existingAdmin) {
            console.log("✅ Admin already exists!");
            process.exit(0);
        }

        // Encrypt password securely
        const hashPassword = CryptoJS.AES.encrypt(
            process.env.ADMIN_PASSWORD, 
            process.env.ENCRYPTION_KEY
        ).toString();

        const adminUser = new userModel({
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: hashPassword, // Now stored securely
            isAdmin: true
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully');
    } catch (error) {
        console.error("❌ Error creating admin:", error);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => console.error('❌ MongoDB connection error:', err));
