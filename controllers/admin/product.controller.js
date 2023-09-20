const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let objectSearch = searchHelper(req.query);

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
    const objectPagination = paginationHelper(initPagination, req.query, countProducts);

    // End Pagination
    const products = await Product.find(findConditions)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    if (products.length > 0) {
        res.render('admin/pages/products/index', {
            pageTitle: "Product Catalog",
            products: products,
            filterStatus: filterStatus,
            keyword: objectSearch.keyword,
            pagination: objectPagination
        });
    } else {
        let queryStr = "";
        for (let key in req.query) {
            if (key !== 'page') {
                queryStr += `&${key}=${req.query[key]}`
            }
        }
        res.redirect(`/${systemConfig.prefixPathAdmin}/products?page=1${queryStr}`)
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });

    res.redirect('back');
};

// [PATCH] /admin/products/change-multi
module.exports.changeMultiStatus = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case 'active':
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids } }, { status: type });
            break;
        default:
            break;
    }

    res.redirect('back');
};

// [DELETE] /admin/products/delete
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // perminent Delete
    // await Product.deleteOne({ _id: id })

    // Temporary delete
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });

    res.redirect('back');
};