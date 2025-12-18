import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    userId: string;
    role: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Skip auth for login/public routes if applying globally, 
    // but usually we apply this middleware to specific routes.

    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader) {
        token = authHeader.split(' ')[1]; // Bearer <token>
    } else if (req.query.token) {
        token = req.query.token as string;
    }

    if (!token) {
        return res.status(401).json({ error: 'Token missing or Authorization header missing' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_prod';
        const decoded = jwt.verify(token, secret) as UserPayload;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
