const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/product');

// [GET] /
module.exports.index = async (req, res) => {
    // hiển thị danh sách nổi bật
    const standOutProducts = await Product.find({
        featured: "1",
        deleted: false,
        status: "active",
    }).limit(6);

    const newStandOutProducts = productsHelper.newPriceProducts(standOutProducts);
    // Hết Hiển thị danh sách sản phẩm nổi bật

    // hiển thị danh sách sản phẩm mới nhất
    const newReleasedProducts = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(6);
    // hết hiển thị danh sách sản phẩm mới nhất

    res.render('client/pages/home/index', {
        pageTitle: "Home Page",
        productsFeatured: newStandOutProducts,
        newReleasedProducts: newReleasedProducts
    });
};