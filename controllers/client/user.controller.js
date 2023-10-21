const User = require('../../models/user.model');
const md5 = require('md5');

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render('client/pages/user/index', {
        pageTitle: 'Register'
    });
};

// [GET] /user/registerPost
module.exports.registerPost = async (req, res) => {

    const existsEmail = await User.findOne({
        email: req.body.email
    });

    if (existsEmail) {
        req.flash('error', 'Email already existed!');
        res.redirect('back');
        return;
    };

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/')
};