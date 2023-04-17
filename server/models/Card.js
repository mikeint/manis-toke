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

    primeImg: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Card = mongoose.model('cards', Cardschema); 