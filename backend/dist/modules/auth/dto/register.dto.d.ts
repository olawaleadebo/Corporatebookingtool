import { UserRole } from '../../users/entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: UserRole;
    department?: string;
    costCenter?: string;
}
