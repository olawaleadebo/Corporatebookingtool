import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { logger } from '../utils/logger';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded: any) => {
      if (err) {
        logger.warn('Invalid token attempt', {
          context: 'AuthMiddleware',
          error: err.message,
        });
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
      }

      req.user = {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    });
  } catch (error: any) {
    logger.error('Authentication error', {
      context: 'AuthMiddleware',
      error: error.message,
    });
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        context: 'AuthMiddleware',
        userId: req.user.userId,
        role: req.user.role,
        requiredRoles: roles,
      });
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
