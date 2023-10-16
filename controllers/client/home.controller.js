const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/newPrice');

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
    res.render('client/pages/home/index', {
        pageTitle: "Home Page",
        productsFeatured: newStandOutProducts
    });
};