'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema({
    nameBusinee: String,
    teller: String,
    date: Date,
    total: {type:Number,default:0},
    carrito: []
})

module.exports = mongoose.model('facturas', facturaSchema);