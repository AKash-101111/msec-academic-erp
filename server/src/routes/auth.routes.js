import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import { loginValidation } from '../middleware/validation.js';
import prisma from '../utils/prisma.js';

const router = express.Router();

/**
 * Generate access + refresh tokens
 */
function generateTokens(userId, role) {
    const accessToken = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Short-lived access token
    );

    const refreshToken = jwt.sign(
        { userId, role, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' } // Long-lived refresh token
    );

    return { accessToken, refreshToken };
}

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                studentProfile: {
                    select: {
                        id: true,
                        rollNumber: true,
                        department: true,
                        batch: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    studentProfile: user.studentProfile
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        if (decoded.type !== 'refresh') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token type'
            });
        }

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);

        res.json({
            success: true,
            data: {
                token: accessToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }
        next(error);
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    res.json({
        success: true,
        data: {
            user: req.user
        }
    });
});

export default router;
