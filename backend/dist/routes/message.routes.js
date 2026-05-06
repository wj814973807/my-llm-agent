"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/send", auth_1.authMiddleware, message_controller_1.messageController.sendMessage);
router.post("/stream", auth_1.authMiddleware, message_controller_1.messageController.streamMessage);
router.get("/:sessionId", auth_1.authMiddleware, message_controller_1.messageController.getMessages);
router.delete("/:messageId", auth_1.authMiddleware, message_controller_1.messageController.deleteMessage);
exports.default = router;
//# sourceMappingURL=message.routes.js.map