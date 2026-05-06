import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/send", authMiddleware, messageController.sendMessage);
router.post("/stream", authMiddleware, messageController.streamMessage);
router.get("/:sessionId", authMiddleware, messageController.getMessages);
router.delete("/:messageId", authMiddleware, messageController.deleteMessage);

export default router;
