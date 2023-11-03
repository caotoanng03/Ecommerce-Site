const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

const uploadToCloudinary = require('../../helpers/uploadToCloudinary');

// [GET] /chat/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // SocketIO 
    //_io.on bị kết nối nhiều lần
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];
            console.log(data);

            for (const imageBuffer of data.images) {
                const link = await uploadToCloudinary(imageBuffer);
                images.push(link);
            }

            // lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            });
            await chat.save();

            // Trả data về cho client (realtime)
            _io.emit('SERVER_RETURN_MESSAGE', {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            });

        });

        socket.on('CLIENT_SEND_TYPING', (type) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                userId: userId,
                fullName: fullName,
                type: type
            });
        });
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
