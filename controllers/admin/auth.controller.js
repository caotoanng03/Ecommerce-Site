const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
const md5 = require('md5');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: 'Log In'
    })
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if (!user) {
        req.flash('error', 'email is invalid');
        res.redirect('back');
        return;
    }

    if (md5(password) != user.password) {
        req.flash('error', 'password is wrong');
        res.redirect('back');
        return;
    }

    if (user.status == 'inactve') {
        res.flash('error', 'This account is inactive');
        res.redirect('back');
        return;
    }

    res.cookie('token', user.token);
    res.redirect(`/${systemConfig.prefixPathAdmin}/dashboard`)
};