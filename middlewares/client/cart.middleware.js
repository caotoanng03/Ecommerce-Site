const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        oneYearExpries = 1000 * 60 * 60 * 24 * 365;
        res.cookie('cartId', cart.id, {
            expires: new Date(Date.now() + oneYearExpries)
        });
    } else {
        // khi da co gio hang
        // kiem tra cartId đúng hay không, không đúng thì tạo lại mới
    }

    next();
};