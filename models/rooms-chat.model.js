const mongoose = require("mongoose");

const roomChatSchema = mongoose.Schema({
    title: String,
    avatar: String,
    // color: String,
    // theme: String,
    typeRoom: String,
    status: String,
    users: [
        {
            user_id: String,
            role: String
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, { timestamps: true });

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;