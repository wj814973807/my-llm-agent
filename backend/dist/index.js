"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./config/logger");
const error_1 = require("./middleware/error");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.default);
app.get("/health", (req, res) => {
    res.json({
        success: true,
        data: { status: "ok" },
        message: "服务健康",
    });
});
app.use(error_1.notFoundMiddleware);
app.use(error_1.errorMiddleware);
app.listen(PORT, () => {
    logger_1.logger.info(`服务器运行在 http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map