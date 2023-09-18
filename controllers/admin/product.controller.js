const Product = require("../../models/product.model");
const filterStatusHeper = require("../../helpers/filterStatus");
const searchHeper = require("../../helpers/search");
const paginationHeper = require("../../helpers/pagination");

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

    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 4
    };
    const countProducts = await Product.count(findConditions);
    const objectPagination = paginationHeper(initPagination, req.query, countProducts);
    // End Pagination

    const products = await Product.find(findConditions)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)


    res.render('admin/pages/products/index', {
        pageTitle: "Product Catalog",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}