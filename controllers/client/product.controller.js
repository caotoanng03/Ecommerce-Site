const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/newPrice.js');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = productsHelper.newPriceProducts(products);

    res.render('client/pages/products/index', {
        pageTitle: "Trang Sản Phẩm",
        products: newProducts
    });
}

// [GET] /admin/products/detail/:slug
// slug is not primary key so if it's not exist -> null
// if primary key (id) not exist -> error
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: 'active'
    });
    if (product != null) {
        res.render("client/pages/products/detail", {
            product: product,
            pageTitle: "Product Detail"
        });
    } else {
        res.redirect('/');
    }
};
