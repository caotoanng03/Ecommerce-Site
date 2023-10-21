const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product');

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.products.length > 0) {
        for (const elem of cart.products) {
            const productInfo = await Product.findOne({ _id: elem.product_id });
            productInfo.newPrice = productHelper.newPriceProduct(productInfo);

            elem.productInfo = productInfo;
            elem.totalPrice = elem.quantity * productInfo.newPrice;
        };
    }

    cart.totalOrderPrice = cart.products.reduce((acc, elem) => acc + elem.totalPrice, 0);

    res.render('client/pages/checkout/index', {
        pageTitle: 'Reservation',
        cartDetail: cart,
    })

};
