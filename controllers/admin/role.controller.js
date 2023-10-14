const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('role-group_view')) {
        const records = await Role.find({
            deleted: false
        });

        res.render("admin/pages/roles/index", {
            pageTitle: "Danh sách nhóm quyền",
            records: records
        });
    } else {
        res.send('you have no right to VIEW role group');
    }
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('role-group_create')) {
        res.render("admin/pages/roles/create", {
            pageTitle: "New Role Group",
        });
    } else {
        res.send('you have no right to CREATE role group');
    }
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('role-group_create')) {
        const record = new Role(req.body);
        await record.save();

        req.flash("success", "One role group was added");

        res.redirect(`/${systemConfig.prefixPathAdmin}/roles`);
    } else {
        res.send('you have no right to CREATE role group');
    }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('role-group_edit')) {
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
    } else {
        res.send('you have no right to EDIT role group');
    }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('role-group_edit')) {
        const id = req.params.id;

        await Role.updateOne({ _id: id }, req.body);

        req.flash("success", "The role group was updated");
        res.redirect(`back`);
    } else {
        res.send('you have no right to EDIT role group');
    }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('roles_permissions')) {
        const records = await Role.find({
            deleted: false
        });

        res.render("admin/pages/roles/permissions", {
            pageTitle: "Access Control",
            records: records
        });
    } else {
        res.send('you have no right to VIEW access control');
    }
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const permission = res.locals.role.permissions;

    if (permission.includes('roles_permissions')) {
        const permissions = JSON.parse(req.body.permissions);

        for (const item of permissions) {
            await Role.updateOne({
                _id: item.id
            }, {
                permissions: item.permissions
            })
        };

        req.flash('success', 'Updated Success');
        res.redirect('back');
    } else {
        res.send('you have no right EDIT permissions');
    }
};