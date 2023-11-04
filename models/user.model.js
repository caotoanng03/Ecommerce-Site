const mongoose = require('mongoose');
const generate = require('../helpers/generate');


const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: function () {
            return generate.generateRandomString(30);
        }
    },
    phone: String,
    avatar: String,
    friendList: [
        {
            user_id: String,
            room_chat_id: String
        }
    ],
    acceptFriends: Array,
    requestFriends: Array,
    status: {
        type: String,
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;