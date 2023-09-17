const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {

    let filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex(item => {
            return item.status == req.query.status;
        });

        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => {
            return item.status == "";
        });

        filterStatus[index].class = "active";
    }

    let findConditions = {
        deleted: false
    };

    if (req.query.status) {
        findConditions.status = req.query.status;
    }

    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i");
        findConditions.title = regex;
    }

    const products = await Product.find(findConditions);


    res.render('admin/pages/products/index', {
        pageTitle: "Product Catalog",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
}