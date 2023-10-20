const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddlware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddlware.cartId);

    app.use('/', homeRoutes);

    app.use('/products', productRoutes);

    app.use('/search', searchRoutes);

    app.use('/cart', cartRoutes);
};