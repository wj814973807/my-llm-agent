import { Router } from "express";
import { sessionController } from "../controllers/session.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  sessionController.validateCreateSession,
  sessionController.createSession,
);
router.get("/", authMiddleware, sessionController.getSessions);
router.get("/:sessionId", authMiddleware, sessionController.getSession);
router.put("/:sessionId", authMiddleware, sessionController.updateSession);
router.delete("/:sessionId", authMiddleware, sessionController.deleteSession);

export default router;
