import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authService } from "../services/auth.service";

export const authController = {
  validateLogin: [
    body("email").isEmail().withMessage("请输入有效的邮箱"),
    body("password").isLength({ min: 6 }).withMessage("密码至少6位"),
  ],

  validateRegister: [
    body("email").isEmail().withMessage("请输入有效的邮箱"),
    body("password").isLength({ min: 6 }).withMessage("密码至少6位"),
    body("nickname")
      .optional()
      .isLength({ max: 20 })
      .withMessage("昵称不能超过20字符"),
  ],

  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "输入验证失败",
          errors: errors.array(),
        });
      }

      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: user,
        message: "注册成功",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "输入验证失败",
          errors: errors.array(),
        });
      }

      const { user, token } = await authService.login(req.body);
      res.json({
        success: true,
        data: { user, token },
        message: "登录成功",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
