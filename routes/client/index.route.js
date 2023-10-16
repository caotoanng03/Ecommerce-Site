const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middlewares/clident/category.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use('/', homeRoutes);

    app.use('/products', productRoutes);
};