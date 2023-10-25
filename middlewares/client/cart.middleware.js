const Cart = require('../../models/cart.model');
const User = require('../../models/user.model');

module.exports.cartId = async (req, res, next) => {
    oneYearExpries = 1000 * 60 * 60 * 24 * 365;

    // always create a cartId in cookies if there is no one
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        res.cookie('cartId', cart.id, {
            expires: new Date(Date.now() + oneYearExpries)
        });
    }

    if (req.cookies.tokenUser) {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
        if (!user) {
            res.clearCookie('tokenUser');
            res.redirect('/');
            return;
        }

        const cart = await Cart.findOne({ user_id: user.id });

        if (cart) {
            cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
            res.locals.miniCart = cart;
        } else {
            const cart = new Cart();
            await cart.save();

            res.cookie('cartId', cart.id, {
                expires: new Date(Date.now() + oneYearExpries)
            });
        }

    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });

        if (cart) {
            cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
            res.locals.miniCart = cart;
        } else {
            const cart = new Cart();
            await cart.save();

            res.cookie('cartId', cart.id, {
                expires: new Date(Date.now() + oneYearExpries)
            });
        }
    }

    next();
};