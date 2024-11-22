const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/userAuthRoutes');
const jobPostRoutes=require('./routes/jobPostingRoutes');
 
const path = require('path');


    (() => {
        body_parser();
        db_config();
        routes_config();
        global_Error_Handler();

    })();


async function db_config() {
    try {
        const connect = await mongoose.connect("mongodb+srv://rkumar1:rahul347@cluster0.zi2jyje.mongodb.net/wrocuswebsite")

        if (connect) {
            console.log('database connected successfully')
        }

    } catch (error) {
        console.log(error)
    }
}

function body_parser() {
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json());
    app.use(cors())
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

function routes_config() {
    app.use('/api/userauth', authRoutes)
    app.use('/api',jobPostRoutes)
   
}

function global_Error_Handler() {
    app.use((err, req, res, next) => {
        const errorStatus = req.status || 500;
        const error = err.message && [err.message] || err || "Internal Server Error";
        res.status(errorStatus).send({ error })

    })
}
module.exports = app;



