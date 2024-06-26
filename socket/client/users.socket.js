const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {

        // Người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_REQUEST_FRIEND", async (targetFriendId) => {
            const myUserId = res.locals.user.id;

            // Thêm id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: targetFriendId,
                acceptFriends: myUserId
            });

            if (!existUserAInB) {
                await User.updateOne(
                    { _id: targetFriendId },
                    { $push: { acceptFriends: myUserId } }
                );
            };

            // Thêm id của B vào requestFriends của A
            const existUserBInA = await User.findOne({
                _id: myUserId,
                requestFriends: targetFriendId
            });

            if (!existUserBInA) {
                await User.updateOne(
                    { _id: myUserId },
                    { $push: { requestFriends: targetFriendId } }
                )
            };

            // Lấy độ dài acceptFriends của B trả về cho B (in ra realtime)
            const infoUserB = await User.findOne({ _id: targetFriendId });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                targetFriendId: targetFriendId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lấy thông tin của A trả về cho B (in ra A realtime)
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                targetFriendId: targetFriendId,
                infoUserA: infoUserA
            })
        })

        // Người dùng huỷ gửi yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (targetFriendId) => {
            const myUserId = res.locals.user.id; // id cua A

            // Xoá thì không cần check id có tôn tại hay không
            // Hệ quy chiếu ở A
            // Xoá id của A(myUserId) trong acceptFriends [của B](targetFriendId)
            await User.updateOne(
                { _id: targetFriendId },
                { $pull: { acceptFriends: myUserId } }
            )

            // Xoá id của B(targetFriendId) trong requestFriends [của A](myUserId)
            await User.updateOne(
                { _id: myUserId },
                { $pull: { requestFriends: targetFriendId } }
            );

            // lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({ _id: targetFriendId });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
                targetFriendId: targetFriendId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lấy userId của A để trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                targetFriendId: targetFriendId,
                myUserId: myUserId
            });
        });

        // Người dùng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (targetFriendId) => {
            const myUserId = res.locals.user.id; // id cua B

            // Hệ quy chiếu ở B
            // Xoa Id cua A ra khoi acceptFriends cua B
            await User.updateOne(
                { _id: myUserId },
                { $pull: { acceptFriends: targetFriendId } }
            )

            // Xoá id của B ra khỏi requestFriends của A
            await User.updateOne(
                { _id: targetFriendId },
                { $pull: { requestFriends: myUserId } }
            )
        });

        // Người dùng chấp nhận kết bạn
        socket.on("CLIENT_CONFIRM_FRIEND", async (targetFriendId) => {
            const myUserId = res.locals.user.id; // id cua B

            // verify
            const existAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: targetFriendId
            });

            const existBInA = await User.findOne({
                _id: targetFriendId,
                requestFriends: myUserId
            });
            // Create room chat
            let roomChat;
            if (existAInB && existBInA) {
                roomChat = new RoomChat({
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        },
                        {
                            user_id: targetFriendId,
                            role: "superAdmin"
                        }
                    ]
                });
                await roomChat.save();
            }
            // Thêm {targetFriendId, room_chat_id} của A vào friendlist của B
            // Xoa Id cua A ra khỏi acceptFriends cua B
            if (existAInB) {
                await User.updateOne(
                    { _id: myUserId },
                    {
                        $push: {
                            friendList: {
                                user_id: targetFriendId,
                                room_chat_id: roomChat.id
                            }
                        },
                        $pull: { acceptFriends: targetFriendId }
                    }
                )
            }

            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            // Xóa id của B trong requestFriends của A
            if (existBInA) {
                await User.updateOne(
                    { _id: targetFriendId },
                    {
                        $push: {
                            friendList: {
                                user_id: myUserId,
                                room_chat_id: roomChat.id
                            }
                        },
                        $pull: { requestFriends: myUserId }
                    }
                )
            }

        });
    });
}