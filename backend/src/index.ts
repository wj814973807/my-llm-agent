import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import dotenv from "dotenv";
import router from "./routes";
import { logger } from "./config/logger";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(pinoHttp({ logger }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
    message: "服务健康",
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`服务器运行在 http://localhost:${PORT}`);
});
