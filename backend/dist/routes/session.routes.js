"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../controllers/session.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.authMiddleware, session_controller_1.sessionController.validateCreateSession, session_controller_1.sessionController.createSession);
router.get("/", auth_1.authMiddleware, session_controller_1.sessionController.getSessions);
router.get("/:sessionId", auth_1.authMiddleware, session_controller_1.sessionController.getSession);
router.put("/:sessionId", auth_1.authMiddleware, session_controller_1.sessionController.updateSession);
router.delete("/:sessionId", auth_1.authMiddleware, session_controller_1.sessionController.deleteSession);
exports.default = router;
//# sourceMappingURL=session.routes.js.map