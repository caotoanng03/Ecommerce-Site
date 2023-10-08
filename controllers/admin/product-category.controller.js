const ProductCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/createTree');

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTree(records);

    res.render('admin/pages/products-category/index', {
        pageTitle: 'Product Category',
        records: newRecords
    })
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTree(records);

    res.render("admin/pages/products-category/create", {
        pageTitle: "New Product Category",
        records: newRecords
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position === "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`/${systemConfig.prefixPathAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
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
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: id }, req.body);

    res.redirect(`back`);
};