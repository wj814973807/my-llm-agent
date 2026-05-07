import { Router } from "express";
import authRoutes from "./auth.routes";
import sessionRoutes from "./session.routes";
import messageRoutes from "./message.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);
router.use("/messages", messageRoutes);

export default router;
