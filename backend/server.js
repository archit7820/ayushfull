const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./model/User');
const Startup = require('./model/Startup');
const Investor = require('./model/Investor');
const Incubator = require('./model/Incubator');
const Accelerator = require('./model/Accelerator');

const app = express();
const port = process.env.PORT || 8000;
const secretKey = 'your_secret_key';
const refreshTokenSecret = 'your_refresh_secret_key';

app.use(bodyParser.json());
app.use(cors());

const uri = 'mongodb+srv://ayush:s9Ro9RLGCBKlvb6r@cluster0.lz4qao5.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// User registration endpoint
app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const user = new User({ email, password, role });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// User sign-in endpoint
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }
        const passwordIsValid = user.comparePassword(password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: 86400 }); // 24 hours
        const refreshToken = jwt.sign({ id: user._id, role: user.role }, refreshTokenSecret, { expiresIn: '7d' }); // 7 days
        user.token = token;
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).send({ auth: true, token, refreshToken });
    } catch (error) {
        res.status(500).send('Error signing in');
    }
});

// Token refresh endpoint
app.post('/refreshToken', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(403).send({ auth: false, message: 'No refresh token provided.' });
    }
    try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).send({ auth: false, message: 'Invalid refresh token.' });
        }
        const newToken = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: 86400 }); // 24 hours
        user.token = newToken;
        await user.save();
        res.status(200).send({ auth: true, token: newToken });
    } catch (error) {
        res.status(500).send('Error refreshing token');
    }
});

// Token verification endpoint
app.get('/verifyToken', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).send({ auth: false, message: 'User not found.' });
            }
            res.status(200).send({ auth: true, message: 'Token is valid.', role: user.role });
        } catch (error) {
            res.status(500).send('Error verifying token');
        }
    });
});

// Endpoint to handle startup information
app.post('/startup', async (req, res) => {
    const { token, startupData } = req.body;
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const startup = new Startup({
            userId: user._id,
            ...startupData
        });
        await startup.save();
        res.status(201).send('Startup information saved');
    } catch (error) {
        console.error('Error saving startup information:', error);
        res.status(500).send('Error saving startup information');
    }
});

// Endpoint to handle investor information
app.post('/investor', async (req, res) => {
    const { token, investorData } = req.body;
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const investor = new Investor({
            userId: user._id,
            ...investorData
        });
        await investor.save();
        res.status(201).send('Investor information saved');
    } catch (error) {
        console.error('Error saving investor information:', error);
        res.status(500).send('Error saving investor information');
    }
});

// Endpoint to handle incubator information
app.post('/incubator', async (req, res) => {
    const { token, incubatorData } = req.body;
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const incubator = new Incubator({
            userId: user._id,
            ...incubatorData
        });
        await incubator.save();
        res.status(201).send('Incubator information saved');
    } catch (error) {
        console.error('Error saving incubator information:', error);
        res.status(500).send('Error saving incubator information');
    }
});

// Endpoint to handle accelerator information
app.post('/accelerator', async (req, res) => {
    const { token, acceleratorData } = req.body;
    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const accelerator = new Accelerator({
            userId: user._id,
            ...acceleratorData
        });
        await accelerator.save();
        res.status(201).send('Accelerator information saved');
    } catch (error) {
        console.error('Error saving accelerator information:', error);
        res.status(500).send('Error saving accelerator information');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
