const Product = require('../../models/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });

    const newProducts = products.map(item => {
        item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed();
        return item;
    });


    res.render('client/pages/products/index', {
        pageTitle: "Trang Sản Phẩm",
        products: products
    });
}
