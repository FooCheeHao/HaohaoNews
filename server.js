const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root path request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Read users.json file
    const usersFilePath = path.join(__dirname, 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        let users;
        try {
            users = data ? JSON.parse(data) : {};
        } catch (parseErr) {
            console.error('Error parsing users.json:', parseErr);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (users[username]) {
            return res.status(400).json({ message: 'User already exists' });
        }

        users[username] = { password };

        // Write updated users back to users.json
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to users.json:', writeErr);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read users.json file
    const usersFilePath = path.join(__dirname, 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        let users;
        try {
            users = data ? JSON.parse(data) : {};
        } catch (parseErr) {
            console.error('Error parsing users.json:', parseErr);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!users[username] || users[username].password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});