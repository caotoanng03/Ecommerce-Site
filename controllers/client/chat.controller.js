const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

const chatSocket = require('../../socket/client/chat.socket');

const uploadToCloudinary = require('../../helpers/uploadToCloudinary');

// [GET] /chat/
module.exports.index = async (req, res) => {

    // SocketIO 
    chatSocket(res);
    // End SocketIO

    // lấy ra data và in ra giao diện
    const chats = await Chat.find({
        deleted: false
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select('fullName');
        chat.infoUser = infoUser;
    };

    res.render('client/pages/chat/index', {
        pageTitle: 'Chat',
        chats: chats
    });
};
