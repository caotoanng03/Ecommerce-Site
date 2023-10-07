const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });

    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách nhóm quyền",
        records: records
    });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "New Role Group",
    });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    req.flash("success", "One role group was added");

    res.redirect(`/${systemConfig.prefixPathAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Role.findOne({
            _id: id,
            deleted: false
        });

        res.render("admin/pages/roles/edit", {
            data: data,
            pageTitle: "Edit Role Group"
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixPathAdmin}/roles`);
    }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash("success", "The role group was updated");
    res.redirect(`back`);
};
