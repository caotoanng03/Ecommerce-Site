const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('accounts_view')) {
        const records = await Account.find({
            deleted: false
        })

        for (const record of records) {
            const role = await Role.findOne({ _id: record.role_id });
            record.role = role;
        }

        res.render('admin/pages/accounts/index', {
            pageTitle: 'Account',
            records: records
        })
    } else {
        res.send('you have no right to VIEW accounts page');
    }
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('accounts_create')) {
        const roles = await Role.find({ deleted: false });

        res.render('admin/pages/accounts/create', {
            pageTitle: 'New Account',
            roles: roles
        })
    } else {
        res.send('you have no right to CREATE new account');
    }
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('accounts_create')) {
        req.body.password = md5(req.body.password);

        const account = new Account(req.body);
        account.save();

        res.redirect(`/${systemConfig.prefixPathAdmin}/accounts`);
    } else {
        res.send('you have no right to CREATE new account');
    }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('accounts_edit')) {
        try {
            const roles = await Role.find({ deleted: false });

            const account = await Account.findOne({
                _id: req.params.id,
                deleted: false
            })

            res.render('admin/pages/accounts/edit', {
                pageTitle: 'Edit Account',
                roles: roles,
                account: account
            })
        } catch (error) {
            res.redirect(`/${systemConfig.prefixPathAdmin}/accounts`);
        }
    } else {
        res.send('you have no right to EDIT account');
    }
};

// [PATCH] /admin/accounts/edit:id
module.exports.editPatch = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if (permissions.includes('accounts_edit')) {
        const id = req.params.id;

        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }

        await Account.updateOne({ _id: id }, req.body);
        req.flash('success', 'This account was updated');
        res.redirect('back');

    } else {
        res.send('you have no right to EDIT account');
    }
};