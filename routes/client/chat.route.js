const express = require("express");
const router = express.Router();

const chatAuthMiddlware = require("../../middlewares/client/chat.middleware");

const controller = require("../../controllers/client/chat.controller");

router.get("/:roomChatId", chatAuthMiddlware.isInRoomChat, controller.index);

module.exports = router;