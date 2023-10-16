const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/createTree');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('products-category_view')) {
        let find = {
            deleted: false
        };

        const records = await ProductCategory.find(find);
        const newRecords = createTree(records);

        res.render('admin/pages/products-category/index', {
            pageTitle: 'Product Category',
            records: newRecords
        })
    } else {
        res.send('you have no right to VIEW products category')
    }
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('products-category_create')) {
        let find = {
            deleted: false
        }

        const records = await ProductCategory.find(find);

        const newRecords = createTree(records);

        res.render("admin/pages/products-category/create", {
            pageTitle: "New Product Category",
            records: newRecords
        });
    } else {
        res.send('you have no right to CREATE new category')
    }
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('products-category_view')) {
        if (req.body.position === "") {
            const countRecords = await ProductCategory.countDocuments();
            req.body.position = countRecords + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        const record = new ProductCategory(req.body);
        await record.save();

        res.redirect(`/${systemConfig.prefixPathAdmin}/products-category`);
    } else {
        res.send('you have no right to CREATE new category');
    }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('products-category_edit')) {
        const id = req.params.id;
        let data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTree(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Edit Product Category",
            data: data,
            records: newRecords
        });
    } else {
        res.send('you have no right to EDIT products category');
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;
    if (permissions.includes('products-category_edit')) {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position);

        await ProductCategory.updateOne({ _id: id }, req.body);

        req.flash('success', 'Category Updated')
        res.redirect('back');
    } else {
        res.send('you have no right to EDIT product category')
    }
};