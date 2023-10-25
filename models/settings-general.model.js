const mongoose = require('mongoose');

const settingGeneralSchema = mongoose.Schema({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    map: String,
    instagram: String,
    linkedin: String,
    facebook: String,
    copyright: String
}, { timestamps: true });

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, 'settings-general');

module.exports = SettingGeneral;