import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    refresh(body: {
        refreshToken: string;
    }, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
