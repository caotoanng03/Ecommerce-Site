const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    const myId = res.locals.user.id;

    const listRoomChat = await RoomChat.find({
        "users.user_id": myId,
        typeRoom: "group",
        deleted: false
    });

    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Room-Chat",
        listRoomChat
    });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendList = res.locals.user.friendList;

    for (const friend of friendList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id
        }).select("fullName avatar");

        friend.infoFriend = infoFriend;
    }

    res.render("client/pages/rooms-chat/create", {
        pageTitle: "Create Room Chat",
        friendList
    });
};

// [POST] /rooms-chat/createPost
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;
    const myId = res.locals.user.id;

    const dataRoomChat = {
        title: title,
        typeRoom: "group",
        users: []
    };

    usersId.forEach(userId => {
        dataRoomChat.users.push({
            user_id: userId,
            role: "user"
        });
    });

    dataRoomChat.users.push({
        user_id: myId,
        role: "superAdmin"
    });

    const room = new RoomChat(dataRoomChat);
    await room.save();

    res.redirect(`/chat/${room.id}`);
};

