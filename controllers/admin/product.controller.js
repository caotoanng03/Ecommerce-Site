const Product = require("../../models/product.model");
const filterStatusHeper = require("../../helpers/filterStatus");
const searchHeper = require("../../helpers/search");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHeper(req.query);
    let objectSearch = searchHeper(req.query);

    let findConditions = {
        deleted: false
    };

    if (req.query.status) {
        findConditions.status = req.query.status;
    }

    if (req.query.keyword) {
        findConditions.title = objectSearch.regex;
    }
    const products = await Product.find(findConditions);


    res.render('admin/pages/products/index', {
        pageTitle: "Product Catalog",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}