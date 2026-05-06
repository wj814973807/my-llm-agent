import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`服务器错误: ${error.message}`);

  res.status(500).json({
    success: false,
    message: error.message || "服务器内部错误",
  });
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "接口不存在",
  });
};
