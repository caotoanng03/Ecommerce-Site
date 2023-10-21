const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');

const productHelper = require('../../helpers/product');

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });

    try {
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
    } catch (err) {
        res.redirect('/')
    }
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    try {
        const cart = await Cart.findOne({ _id: cartId });

        let products = [];

        for (const product of cart.products) {
            const objProduct = {
                product_id: product.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: product.quantity
            };

            const productInfo = await Product.findOne({ _id: product.product_id });

            objProduct.price = productInfo.price;
            objProduct.discountPercentage = productInfo.discountPercentage;

            products.push(objProduct);
        };

        const objOrder = {
            cart_id: cartId,
            userInfo: userInfo,
            products: products
        }

        const order = new Order(objOrder);
        await order.save();

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                products: []
            }
        );

        res.redirect(`/checkout/success/${order.id}`);

    } catch (error) {
        res.redirect('/')
    }
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.orderId });

    for (const product of order.products) {

        const productInfo = await Product.findOne({ _id: product.product_id })
            .select('title thumbnail');

        product.productInfo = productInfo;
        product.newPrice = productHelper.newPriceProduct(product);
        product.totalPrice = product.newPrice * product.quantity;
    }

    order.totalOrderPrice = order.products.reduce((acc, elem) => acc + elem.totalPrice, 0);

    res.render('client/pages/checkout/success', {
        pageTitle: 'Success Order',
        order: order
    })
};