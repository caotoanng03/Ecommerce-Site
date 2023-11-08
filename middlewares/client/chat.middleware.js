const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports.isInRoomChat = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const roomChatId = req.params.roomChatId;

        const roomChat = await RoomChat.findOne({
            _id: roomChatId,
            "users.user_id": userId
        });

        if (!roomChat) {
            res.redirect(`/`);
            return;
        };

        next();
    } catch (error) {
        res.redirect('/');
    }
};