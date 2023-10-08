const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`/${systemConfig.prefixPathAdmin}/auth/login`);
        return;
    }

    const user = await Account.findOne({
        token: req.cookies.token
    });

    if (!user) {
        res.redirect(`/${systemConfig.prefixPathAdmin}/auth/login`);
        return;
    }

    next();
};