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
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    // Khi tìm khác trang 1 và xử lý nếu không có sản phẩm trong db
    if (products.length > 0 || countProducts == 0) {
        res.render('admin/pages/products/index', {
            pageTitle: "Product List",
            products: products,
            filterStatus: filterStatus,
            keyword: objectSearch.keyword,
            pagination: objectPagination
        });
    } else {
        let queryString = "";
        for (let key in req.query) {
            if (key !== 'page') {
                queryString += `&${key}=${req.query[key]}`
            }
        }
        const href = `/${systemConfig.prefixPathAdmin}/products?page=1${queryString}`
        res.redirect(href);
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Updated status successfully");

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
            req.flash('success', `Updated status ${ids.length} successfully`);
            break;
        case 'change-position':
            for (let item of ids) {
                const [id, pos] = item.split("-");
                await Product.updateOne({ _id: id }, { position: pos });
            }
            break;
        case 'delete-all':
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: true,
                    deletedAt: new Date()
                });
            req.flash('success', `Deleted ${ids.length} products`);
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
    req.flash('success', '1 product deleted');
    res.redirect('back');
};

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add new product"
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const numberOfAllProducts = await Product.countDocuments();
        req.body.position = numberOfAllProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file && req.file.filename) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const newProduct = new Product(req.body);
    await newProduct.save();

    req.flash('success', '1 product created');

    res.redirect(`/${systemConfig.prefixPathAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/products/edit", {
        product: product,
        pageTitle: "Edit Product"
    });
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file && req.file.filename) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne({ _id: id }, req.body);

    req.flash('success', 'The product was updated');

    res.redirect(`back`);

};