const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = "/" + systemConfig.prefixPathAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN + "/products", productRoutes);
};