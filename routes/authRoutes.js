const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

let db;
(async () => {
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('userDatabase');
})();

// User Registration Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Username and password are required!');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('users').insertOne({ username, password: hashedPassword });
        res.send('User registered successfully!');
    } catch (err) {
        console.error('Error registering user:', err);
        res.send('Error registering user.');
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Username and password are required!');
    }

    try {
        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return res.send('Invalid username or password!');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.send('Login successful!');
        } else {
            res.send('Invalid username or password!');
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.send('Error logging in.');
    }
});

module.exports = router;
