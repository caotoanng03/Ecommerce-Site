const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

// [GET] /chat/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;

    // SocketIO (_io.on bị kết nối nhiều lần)
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (content) => {
            // lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
        })
    });
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