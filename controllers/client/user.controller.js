const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const generateHelper = require('../../helpers/generate');
const sendMailHelper = require('../../helpers/sendMail');
const md5 = require('md5');

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render('client/pages/user/index', {
        pageTitle: 'Register'
    });
};

// [GET] /user/register
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

// [POST] /user/login
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

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie('tokenUser');
    res.redirect('/');
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render('client/pages/user/forgot', {
        pageTitle: 'Forgot Password',
    });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
        req.flash('error', 'Email does not exist');
        res.redirect('back');
        return;
    }

    // step1: create opt and store to database
    const otp = generateHelper.generateRandomNumber(7);

    const forgotPassObject = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(forgotPassObject);
    await forgotPassword.save();

    // step2: send opt code to user's email
    const subject = '[Ecommerce-site] OTP code to reset password';
    const html = `    	
        <h3>Reset Password</h3>
    A password reset event has been triggered. Here is your otp code: <h5>${otp}</h5>
    The OTP code is limited to 3 minutes.
    If you do not reset your password within 3 minutes, you will need to submit a new request.
    `;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render('client/pages/user/opt-password', {
        pageTitle: 'Enter OTP Password',
        email: email
    })
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        req.flash('error', 'OTP code is not valid');
        res.redirect('back');
        return;
    };

    const user = await User.findOne({
        email: email
    });

    res.cookie('tokenUser', user.tokenUser);
    res.redirect(`/user/password/reset`);
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {

    res.render('client/pages/user/reset-password', {
        pageTitle: 'Reset Password'
    });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {

    const user = await User.findOne({ tokenUser: req.cookies.tokenUser });

    if (user) {
        await User.updateOne({
            _id: user.id
        }, {
            password: md5(req.body.password)
        })

        req.flash('success', 'Your password was reset');
        res.redirect('/');

    } else {
        res.redirect('back')
        return;
    }
};

// [GET] /user/info
module.exports.info = async (req, res) => {

    res.render('client/pages/user/info', {
        pageTitle: 'User Profile'
    });
};


