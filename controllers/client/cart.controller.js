const Cart = require('../../models/cart.model');

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