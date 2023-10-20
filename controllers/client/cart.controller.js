const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product');

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;

            const productInfo = await Product.findOne({
                _id: productId
            });

            productInfo.newPrice = productHelper.newPriceProduct(productInfo);

            item.productInfo = productInfo;
            item.totalPrice = productInfo.newPrice * item.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render('client/pages/cart/index', {
        pageTitle: 'Cart',
        cartDetail: cart,
    });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProductsInCart = cart.products.find(elem => elem.product_id == productId);

    if (existProductsInCart) {
        const newQuantity = quantity + existProductsInCart.quantity;

        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        );
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        )
    }

    req.flash('success', 'Success Added to Cart');
    res.redirect('back');
};