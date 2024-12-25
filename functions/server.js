const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Handle the root path request
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// User registration
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to encrypt password' });
        }

        const usersFilePath = path.join(__dirname, '..', 'public', 'data', 'users.json');
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

            users[username] = { password: hash, feedbacks: [] };

            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to users.json:', writeErr);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
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

        const user = users[username];
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!result) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            res.status(200).json({ message: 'Login successful' });
        });
    });
});

// Admin delete user
router.delete('/delete-user', (req, res) => {
    const usersFilePath = path.join(__dirname, '..', 'public', 'data', 'users.json');
    const email = req.query.email;
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read user data' });
        }

        const users = JSON.parse(data);

        if (!users[email]) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete users[email];

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete user' });
            }

            res.status(200).json({ message: 'User deleted successfully' });
        });
    });
});

// Admin delete user feedback
router.delete('/delete-feedback', (req, res) => {
    const { email, feedbackIndex } = req.query;
    const usersFilePath = path.join(__dirname, '..', 'public', 'data', 'users.json');
    
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read user data' });
        }

        const users = JSON.parse(data);

        if (!users[email]) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!Array.isArray(users[email].feedbacks) || users[email].feedbacks.length <= feedbackIndex) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        users[email].feedbacks.splice(feedbackIndex, 1);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete feedback' });
            }

            res.status(200).json({ message: 'Feedback deleted successfully' });
        });
    });
});

// Change password
router.post('/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    const usersFilePath = path.join(__dirname, '..', 'public', 'data', 'users.json');
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

        const user = users[username];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.compare(oldPassword, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to compare passwords' });
            }

            if (!result) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to encrypt new password' });
                }

                user.password = hash;

                fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to save new password' });
                    }

                    res.status(200).json({ message: 'Password changed successfully' });
                });
            });
        });
    });
});

// Handle feedback submission
router.post('/submit-feedback', (req, res) => {
    const { username, rating, feedback } = req.body;

    const feedbackFilePath = path.join(__dirname, '..', 'public', 'data', 'users.json');
    fs.readFile(feedbackFilePath, 'utf8', (err, data) => {
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

        if (!users[username]) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!Array.isArray(users[username].feedbacks)) {
            users[username].feedbacks = [];
        }

        users[username].feedbacks.push({ rating, feedback });

        fs.writeFile(feedbackFilePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to users.json:', writeErr);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(201).json({ message: 'Feedback submitted successfully, Thank you!' });
        });
    });
});

app.use('/.netlify/functions/server', router);

module.exports.handler = serverless(app);