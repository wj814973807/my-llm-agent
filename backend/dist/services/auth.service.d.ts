import type { User, LoginDto, RegisterDto } from "../types";
export declare const authService: {
    register(dto: RegisterDto): Promise<User>;
    login(dto: LoginDto): Promise<{
        user: User;
        token: string;
    }>;
    verifyToken(token: string): Promise<string>;
};
