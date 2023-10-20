const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
    oneYearExpries = 1000 * 60 * 60 * 24 * 365;
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        res.cookie('cartId', cart.id, {
            expires: new Date(Date.now() + oneYearExpries)
        });
    } else {
        // khi da co gio hang -> tra so luong cho nut minicart
        // kiem tra cartId đúng hay không, không đúng thì tạo lại mới
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