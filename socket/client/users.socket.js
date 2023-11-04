const User = require("../../models/user.model");

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
    });
}