module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Full Name can not be empty!');
        res.redirect('back');
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Email can not be empty!');
        res.redirect('back');
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Password can not be empty!');
        res.redirect('back');
        return;
    }

    next();
};

module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Email can not be empty!');
        res.redirect('back');
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Email can not be empty!');
        res.redirect('back');
        return;
    }

    next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Email can not be empty');
        res.redirect('back');
        return;
    }

    next();
};

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash('error', 'Password can not be empty');
        res.redirect('back');
        return;
    }

    if (!req.body.confirmPassword) {
        req.flash('error', 'Confirm password can not be empty');
        res.redirect('back');
        return;
    }

    if (req.body.password !== req.body.confirmPassword) {
        req.flash('error', 'Confirm password does not match');
        res.redirect('back');
        return;
    }

    next();
};