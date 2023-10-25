const SettingGeneral = require('../../models/settings-general.model');


// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render('admin/pages/settings/general', {
        pageTitle: 'General Setting',
        settingGeneral: settingGeneral
    })
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if (settingGeneral) {
        await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    } else {
        const setting = new SettingGeneral(req.body);
        setting.save();
    }

    req.flash('success', 'Settings Updated');
    res.redirect('back');
};