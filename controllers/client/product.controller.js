const Product = require('../../models/product.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = products.map(item => {
        item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed();
        return item;
    });


    res.render('client/pages/products/index', {
        pageTitle: "Trang Sản Phẩm",
        products: products
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
        res.render("admin/pages/products/detail", {
            product: product,
            pageTitle: "Product Detail"
        });
    } else {
        res.redirect('/');
    }
};
