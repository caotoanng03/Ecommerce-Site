const Cart = require('../../models/cart.model');
const User = require('../../models/user.model');
const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product');

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })
    try {
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
    } catch (err) {
        res.redirect('/')
    }

};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {

    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    let cart = {}
    if (req.cookies.tokenUser) {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser })
        cart = await Cart.findOne({ user_id: user.id });
    } else {
        cart = await Cart.findOne({ _id: req.cookies.cartId });
    }

    const cartId = cart.id;
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

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
        _id: cartId,
    }, {
        '$pull': { products: { 'product_id': productId } }
    });

    req.flash('success', 'Throwed one item from cart');
    res.redirect('back');
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
        {
            _id: cartId,
            'products.product_id': productId
        },
        {
            'products.$.quantity': quantity
        }
    );

    req.flash('success', 'Updated quantity');
    res.redirect('back');
};