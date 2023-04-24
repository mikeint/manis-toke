const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const Cardschema = new Schema({
    strain: {
        type: String,
    },
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    nameCross: {
        type: String,
    },
    thc: {
        type: String,
    },
    cbd: {
        type: String,
    },
    description: {
        type: String,
    },
    amount: {
        type: String,
    },
    price: {
        type: String,
    },
    newCheckBtn: {
        type: Boolean,
    },
    recommendCheckBtn: {
        type: Boolean,
    },
    onFire: {
        type: Boolean,
    },
    disabled: {
        type: Boolean,
    },
    company_image: {
        data: Buffer,
        contentType: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Card = mongoose.model('cards', Cardschema);
