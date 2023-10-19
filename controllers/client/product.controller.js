const Product = require('../../models/product.model');
const productsHelper = require('../../helpers/product.js');
const ProductCategory = require('../../models/product-category.model');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = productsHelper.newPriceProducts(products);

    res.render('client/pages/products/index', {
        pageTitle: "Product",
        products: newProducts
    });
}

// [GET] /products/detail/:slugProduct
// slug is not primary key so if it's not exist -> null
// if primary key (id) not exist -> error
module.exports.detail = async (req, res) => {
    const slug = req.params.slugProduct;

    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: 'active'
    });

    if (product != null) {
        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                deleted: false,
                status: 'active'
            })
            product.category = category;
        };

        product.newPrice = productsHelper.newPriceProduct(product);

        res.render("client/pages/products/detail", {
            product: product,
            pageTitle: "Product Detail"
        });
    } else {
        res.redirect('/');
    }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false,
        status: "active"
    });

    const getSubCategories = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            deleted: false,
            status: "active"
        });

        let allSubs = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategories(sub.id);
            allSubs = allSubs.concat(childs);
        }

        return allSubs;
    };

    const listSubCategory = await getSubCategories(category.id);
    const listSubCategoryID = listSubCategory.map(elem => elem.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryID] },
        deleted: false,
        status: "active"
    }).sort({ position: -1 });

    const newProducts = productsHelper.newPriceProducts(products);

    res.render('client/pages/products/index', {
        pageTitle: category.title,
        products: newProducts
    });
};
