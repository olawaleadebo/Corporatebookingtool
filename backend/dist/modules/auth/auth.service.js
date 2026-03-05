"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, logger) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = logger;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, phoneNumber, role, department, costCenter } = registerDto;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            role,
            department,
            costCenter,
        });
        this.logger.info('User registered successfully', { context: 'AuthService', userId: user.id });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.usersService.updateLastLogin(user.id);
        this.logger.info('User logged in successfully', { context: 'AuthService', userId: user.id });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
            }),
        ]);
        await this.usersService.updateRefreshToken(userId, refreshToken);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        const isRefreshTokenValid = user.refreshToken === refreshToken;
        if (!isRefreshTokenValid) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return tokens;
    }
    async logout(userId) {
        await this.usersService.updateRefreshToken(userId, null);
        this.logger.info('User logged out', { context: 'AuthService', userId });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        winston_1.Logger])
], AuthService);
//# sourceMappingURL=auth.service.js.map