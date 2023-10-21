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

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render('client/pages/user/login', {
        pageTitle: 'Sign in'
    });
};

// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
        req.flash('error', 'Email is not correct');
        res.redirect('back');
        return;
    };

    if (md5(password) !== user.password) {
        req.flash('error', 'Password is not correct');
        res.redirect('back');
        return;
    };

    if (user.status === 'inactive') {
        req.flash('error', 'This account is being baned');
        res.redirect('back');
        return;
    }

    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/');
};