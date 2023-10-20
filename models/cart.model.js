const mongoose = require('mongoose');

const cartShema = mongoose.Schema({
    user_id: String,
    products: [
        {
            product_id: String,
            quantity: Number
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartShema, "carts");

module.exports = Cart;