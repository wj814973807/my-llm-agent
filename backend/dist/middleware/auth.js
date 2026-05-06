"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_service_1 = require("../services/auth.service");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "未授权访问",
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await auth_service_1.authService.verifyToken(token);
        req.userId = userId;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "无效的token",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map