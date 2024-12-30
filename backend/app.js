const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs');
require('dotenv').config();

const app = express();

const corsConfig = {
    origin: process.env.Client_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
};

app.options("", cors(corsConfig));

// Middleware
app.use(express.json());
app.use(cors(corsConfig));

// Routes using readdirSync (will work locally)
if (process.env.NODE_ENV !== 'production') {
    readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));
} else {
    // For Vercel, directly require your route files
    // This assumes your routes folder contains these files - adjust according to your actual route files
    app.use('/api/v1', require('./routes/expenses'));
    app.use('/api/v1', require('./routes/income'));
    // Add other routes as needed
}

// Database connection
db();

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log('Listening to port:', PORT);
    });
}

// For Vercel
module.exports = app;
