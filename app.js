const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/userAuthRoutes');
const jobPostRoutes = require('./routes/jobPostingRoutes');
const path = require('path');

// Immediately invoke the configuration functions
(() => {
    configureBodyParser();
    configureDatabase();
    configureRoutes();
    configureGlobalErrorHandler();
})();

// ✅ Configure Database Connection
async function configureDatabase() {
    try {
        // const connect = await mongoose.connect("mongodb+srv://rkumar1:rahul347@cluster0.zi2jyje.mongodb.net/wrocuswebsite", {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // });
           
        const connect = await mongoose.connect("mongodb+srv://aseem:jRLYMTbs3nLB004f@wrocuswebsite.mlaja.mongodb.net/?retryWrites=true&w=majority&appName=wrocuswebsite", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        if (connect) {
            console.log('✅ Database connected successfully');
        }
    } catch (error) {
        console.error('❌ Database connection error:', error);
    }
}

// ✅ Configure Middleware (CORS, Body Parser, Static Files)
function configureBodyParser() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // 🔹 Configure CORS properly
    app.use(cors({
        origin: "http://localhost:3000",  // 🔹 Change this to match your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }));

    // Serve static files (if needed)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// ✅ Configure API Routes
function configureRoutes() {
    app.use('/api/userauth', authRoutes);
    app.use('/api', jobPostRoutes);
}

// ✅ Configure Global Error Handler
function configureGlobalErrorHandler() {
    app.use((err, req, res, next) => {
        const errorStatus = err.status || 500;
        const errorMessage = err.message || "Internal Server Error";
        console.error('❌ Error:', errorMessage);

        res.status(errorStatus).json({ error: errorMessage });
    });
}

module.exports = app;
