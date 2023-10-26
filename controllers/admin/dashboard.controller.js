const ProductCategory = require('../../models/product-category.model');
const Product = require('../../models/product.model');
const account = require('../../models/account.model');
const User = require('../../models/user.model');
const Account = require('../../models/account.model');

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    statistic.categoryProduct.total = await ProductCategory.countDocuments({ deleted: false });
    statistic.categoryProduct.active = await ProductCategory.countDocuments({ status: 'active' });
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({ status: 'inactive' });

    statistic.product.total = await Product.countDocuments({ deleted: false });
    statistic.product.active = await Product.countDocuments({ status: 'active' });
    statistic.product.inactive = await Product.countDocuments({ status: 'inactive' });

    statistic.account.total = await Account.countDocuments({ deleted: false });
    statistic.account.active = await Account.countDocuments({ status: 'active' });
    statistic.account.inactive = await Account.countDocuments({ status: 'inactive' });

    statistic.user.total = await User.countDocuments({ deleted: false });
    statistic.user.active = await User.countDocuments({ status: 'active' });
    statistic.user.inactive = await User.countDocuments({ status: 'inactive' });

    res.render('admin/pages/dashboard/index', {
        pageTitle: "Dashboard",
        statistic: statistic
    });
};