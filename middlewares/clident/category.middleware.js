const ProductCategory = require("../../models/product-category.model");

const createTree = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    const categoryProducts = await ProductCategory.find({
        deleted: false
    });
    console.log(categoryProducts);
    const newCategoryProducts = createTree(categoryProducts);

    res.locals.layoutCategoryProducts = newCategoryProducts;

    next();
}