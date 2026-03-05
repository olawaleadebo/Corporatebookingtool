import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    updateLastLogin(id: string): Promise<void>;
    updateRefreshToken(id: string, refreshToken: string | any): Promise<void>;
    update(id: string, userData: Partial<User>): Promise<User>;
    remove(id: string): Promise<void>;
}
