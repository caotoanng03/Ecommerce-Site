const Product = require('../../models/product.model');

const productsHelper = require('../../helpers/product.js');

// [GET] /search/
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let newProducts = [];

    if (keyword) {
        const keywordRegex = new RegExp(keyword, 'i');
        const products = await Product.find({
            title: keywordRegex,
            deleted: false,
            status: 'active'
        });

        newProducts = productsHelper.newPriceProducts(products);
    }

    res.render('client/pages/search/index', {
        pageTitle: 'Search Result',
        keyword: keyword,
        products: newProducts
    });
};