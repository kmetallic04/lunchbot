const mongoose = require('mongoose');
const { selectDb } = require('../utils');

const db = selectDb();

//Menu items Schema
const categories = ["Drinks", "Meat Dishes", "Vegetable Dishes", "Specials", "Others"];

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Name is required'
        ]
    },
    category: {
        type: String,
        enum: categories,
        required: [
            true,
            'Category is required'
        ]
    },
    price: {
        type: Number,
        min: 1.000,
        required: [
            true,
            'Price is required'
        ]
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [
            true,
            'Vendor is required'
        ]
    }
});

module.exports = db.model('Item', itemSchema);
