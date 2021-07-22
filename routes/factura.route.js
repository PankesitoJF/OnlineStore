'use strict'

var express = require('express');
var facturaController = require('../controllers/factura.controller');
var api = express.Router();

api.post('/saveFactura', facturaController.saveFactura);
api.put('/totalSale', facturaController.totalSale);
api.get('/productsOfFactura/:id', facturaController.productsOfFactura);
api.put('/setCarrito/:id', facturaController.setCarrito);

module.exports = api;