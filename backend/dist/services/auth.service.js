"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const logger_1 = require("../config/logger");
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 10;
exports.authService = {
    async register(dto) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new Error("用户已存在");
        }
        const hashedPassword = await bcrypt_1.default.hash(dto.password, SALT_ROUNDS);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                nickname: dto.nickname || "",
            },
        });
        logger_1.logger.info(`用户注册成功: ${user.email}`);
        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
    async login(dto) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new Error("邮箱或密码错误");
        }
        const isPasswordValid = await bcrypt_1.default.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error("邮箱或密码错误");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        logger_1.logger.info(`用户登录成功: ${user.email}`);
        return {
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        };
    },
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return decoded.userId;
        }
        catch (error) {
            throw new Error("无效的token");
        }
    },
};
//# sourceMappingURL=auth.service.js.map