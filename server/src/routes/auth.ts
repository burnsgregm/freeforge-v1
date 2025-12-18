import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login attempt failed: User not found (${email})`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            console.log(`Login attempt failed: Invalid password for ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log(`Login successful for ${email}`);

        // Generate Token
        const secret = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_prod';
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                email: user.email
            },
            secret,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    // For MVP/Demo: Allow registration of first user as ADMIN, others as VIEWERS
    // Or just open registration for "OPERATOR"
    try {
        const { email, password, username } = req.body;

        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const count = await User.countDocuments();
        const role = count === 0 ? 'ADMIN' : 'OPERATOR';

        const user = new User({
            email,
            passwordHash: password, // Will be hashed by pre-save hook
            username,
            role
        });

        await user.save();

        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

export default router;
