"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = exports.errorMiddleware = void 0;
const logger_1 = require("../config/logger");
const errorMiddleware = (error, req, res, next) => {
    logger_1.logger.error(`服务器错误: ${error.message}`);
    res.status(500).json({
        success: false,
        message: error.message || "服务器内部错误",
    });
};
exports.errorMiddleware = errorMiddleware;
const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        message: "接口不存在",
    });
};
exports.notFoundMiddleware = notFoundMiddleware;
//# sourceMappingURL=error.js.map