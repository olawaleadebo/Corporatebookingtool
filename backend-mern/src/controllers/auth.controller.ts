import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';
import { jwtConfig } from '../config/jwt';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role,
        department,
        costCenter,
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        throw new AppError('Missing required fields', 400);
      }

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: role || UserRole.TRAVELLER,
        department,
        costCenter,
      });

      logger.info('User registered successfully', {
        context: 'AuthController',
        userId: user._id,
        email: user.email,
      });

      // Generate tokens
      const tokens = this.generateTokens(user._id.toString(), user.email, user.role);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          ...tokens,
        },
      });
    } catch (error: any) {
      logger.error('Registration error', {
        context: 'AuthController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to register user',
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Find user with password field
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Account is deactivated', 403);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      logger.info('User logged in successfully', {
        context: 'AuthController',
        userId: user._id,
        email: user.email,
      });

      // Generate tokens
      const tokens = this.generateTokens(user._id.toString(), user.email, user.role);

      // Update refresh token in database
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          ...tokens,
        },
      });
    } catch (error: any) {
      logger.error('Login error', {
        context: 'AuthController',
        error: error.message,
      });
      
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to login',
        });
      }
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      // Verify refresh token
      const decoded: any = jwt.verify(refreshToken, jwtConfig.refreshSecret);

      // Find user
      const user = await User.findById(decoded.sub).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 403);
      }

      // Generate new tokens
      const tokens = this.generateTokens(user._id.toString(), user.email, user.role);

      // Update refresh token
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens,
      });
    } catch (error: any) {
      logger.error('Token refresh error', {
        context: 'AuthController',
        error: error.message,
      });
      
      res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      // Clear refresh token
      await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });

      logger.info('User logged out', {
        context: 'AuthController',
        userId: req.user.userId,
      });

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error: any) {
      logger.error('Logout error', {
        context: 'AuthController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to logout',
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          department: user.department,
          costCenter: user.costCenter,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error: any) {
      logger.error('Get profile error', {
        context: 'AuthController',
        error: error.message,
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
      });
    }
  }

  private generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const accessToken = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiration,
    });

    const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiration,
    });

    return { accessToken, refreshToken };
  }
}
