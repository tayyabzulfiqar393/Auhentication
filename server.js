
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27017';
const dbName = 'userDatabase';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
let db;
(async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
})();

// Routes
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
