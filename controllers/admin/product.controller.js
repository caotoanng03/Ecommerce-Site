const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTree = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('products_view')) {
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

        // Sort
        let sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.position = "desc";
        }
        // End Sort
        const products = await Product.find(findConditions)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)

        for (const product of products) {
            // log of user create
            const userCreated = await Account.findOne({
                _id: product.createdBy.account_id
            });

            if (userCreated) {
                product.createdBy.accountFullName = userCreated.fullName;
            }

            // log of user update
            const userUpdatedId = product.updatedBy.slice(-1)[0];
            if (userUpdatedId) {
                const userUpdated = await Account.findOne({
                    _id: userUpdatedId.account_id
                });

                if (userUpdated) {
                    userUpdatedId.accountFullName = userUpdated.fullName;
                }
            }
        }
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
    } else {
        res.send('You have no right to VIEW')
    }

}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_edit')) {
        try {
            const status = req.params.status;
            const id = req.params.id;

            const updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            }

            await Product.updateOne({ _id: id },
                {
                    status: status,
                    $push: { updatedBy: updatedBy }
                });

            req.flash("success", "Status updated");

            res.redirect('back');
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        res.send('you have no right to EDIT')
    }
};

// [PATCH] /admin/products/change-multi
module.exports.changeMultiStatus = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_edit')) {
        const type = req.body.type;
        const ids = req.body.ids.split(', ');

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        }

        switch (type) {
            case 'active':
            case 'inactive':
                await Product.updateMany({ _id: { $in: ids } },
                    {
                        status: type,
                        $push: { updatedBy: updatedBy }
                    });
                req.flash('success', `Updated ${ids.length} products status`);
                break;
            case 'change-position':
                for (let item of ids) {
                    const [id, pos] = item.split("-");
                    await Product.updateOne({ _id: id }, {
                        position: pos,
                        $push: { updatedBy: updatedBy }
                    });
                }
                break;
            case 'delete-all':
                await Product.updateMany({ _id: { $in: ids } },
                    {
                        deleted: true,
                        deletedBy: {
                            account_id: res.locals.user.id,
                            deletedAt: new Date(),
                        }
                    });
                req.flash('success', `Deleted ${ids.length} products`);
                break;
            default:
                break;
        }
        res.redirect('back');
    } else {
        res.send('you have no right to EDIT')
    }
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_delete')) {
        const id = req.params.id;

        // perminent Delete
        // await Product.deleteOne({ _id: id })

        // Temporary delete
        await Product.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            }
        });
        req.flash('success', '1 product deleted');
        res.redirect('back');
    } else {
        res.send('you have no right to DELETE');
    }
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_create')) {
        let find = {
            deleted: false
        }

        const records = await ProductCategory.find(find);

        const newRecords = createTree(records);

        res.render("admin/pages/products/create", {
            pageTitle: "Add new product",
            records: newRecords
        });
    } else {
        res.send('you have no right to CREATE');
    }
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_create')) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        if (req.body.position == "") {
            const numberOfAllProducts = await Product.countDocuments();
            req.body.position = numberOfAllProducts + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        // if (req.file && req.file.filename) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }

        req.body.createdBy = {
            account_id: res.locals.user.id
        }

        const newProduct = new Product(req.body);
        await newProduct.save();

        req.flash('success', '1 product created');

        res.redirect(`/${systemConfig.prefixPathAdmin}/products`);
    } else {
        res.send('you have no right to CREATE')
    }
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_edit')) {
        try {
            const id = req.params.id;
            const product = await Product.findOne({
                _id: id,
                deleted: false
            });

            const records = await ProductCategory.find({
                deleted: false
            });

            const newRecords = createTree(records);

            res.render("admin/pages/products/edit", {
                product: product,
                records: newRecords,
                pageTitle: "Edit Product"
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixPathAdmin}/products`);
        }
    } else {
        res.send('you have no right to EDIT')
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_edit')) {
        try {
            const id = req.params.id;
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.position = parseInt(req.body.position);

            // if (req.file && req.file.filename) {
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }
            const updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            }
            await Product.updateOne({ _id: id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });

            req.flash('success', 'The product was updated');
            res.redirect(`back`);
        } catch (error) {
            res.redirect(`/${systemConfig.prefixPathAdmin}/products`);
        }
    } else {
        res.send('you have no right to EDIT');
    }

};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products_view')) {
        try {
            const id = req.params.id;
            const product = await Product.findOne({
                _id: id,
                deleted: false
            });

            res.render("admin/pages/products/detail", {
                product: product,
                pageTitle: "Detail"
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixPathAdmin}/products`);
        }
    } else {
        res.send('you have no right to view DETAIL')
    }
};