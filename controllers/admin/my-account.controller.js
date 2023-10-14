const md5 = require('md5');
const Account = require('../../models/account.model');

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render('admin/pages/my-account/index', {
        pageTitle: 'Personal Information'
    });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render('admin/pages/my-account/edit', {
        pageTitle: 'Edit Personal Information'
    })
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;

    if (req.body.password) {
        req.body.password = md5(req.body.password)
    } else {
        delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash('success', 'Information Updated');
    res.redirect('back');
};