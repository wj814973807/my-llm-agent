"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
exports.authController = {
    validateLogin: [
        (0, express_validator_1.body)("email").isEmail().withMessage("请输入有效的邮箱"),
        (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("密码至少6位"),
    ],
    validateRegister: [
        (0, express_validator_1.body)("email").isEmail().withMessage("请输入有效的邮箱"),
        (0, express_validator_1.body)("password").isLength({ min: 6 }).withMessage("密码至少6位"),
        (0, express_validator_1.body)("nickname")
            .optional()
            .isLength({ max: 20 })
            .withMessage("昵称不能超过20字符"),
    ],
    async register(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: "输入验证失败",
                    errors: errors.array(),
                });
            }
            const user = await auth_service_1.authService.register(req.body);
            res.status(201).json({
                success: true,
                data: user,
                message: "注册成功",
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    async login(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: "输入验证失败",
                    errors: errors.array(),
                });
            }
            const { user, token } = await auth_service_1.authService.login(req.body);
            res.json({
                success: true,
                data: { user, token },
                message: "登录成功",
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map