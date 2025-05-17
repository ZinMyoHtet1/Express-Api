const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        uppercase: true,
        default: "USD"
    },
    image_url: {
        type: String,
        required: true
    },
    description: String
}, { timestamps: true });

module.exports = mongoose.model("Phone", phoneSchema);
