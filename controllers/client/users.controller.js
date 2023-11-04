const User = require("../../models/user.model");

const usersSocket = require("../../socket/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    //Socket
    usersSocket(res);
    //End Socket

    const userId = res.locals.user.id;

    const myUser = await User.findOne({ _id: userId });

    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } }
        ],
        status: "active",
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/not-friend", {
        pageTitle: "Suggestions",
        users: users
    });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
    //
    usersSocket(res);
    //
    const myUserId = res.locals.user.id;

    const myUser = await User.findOne({ _id: myUserId });

    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/pages/users/request", {
        pageTitle: "Sent Friends",
        users: users
    })
};