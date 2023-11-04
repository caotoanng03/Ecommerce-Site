const User = require("../../models/user.model");

module.exports = async (res) => {
    _io.once('connection', (socket) => {
        socket.on('CLIENT_REQUEST_FRIEND', async (targetFriendId) => {
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
    })
}