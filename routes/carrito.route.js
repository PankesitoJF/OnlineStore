"use strict"

var express = require("express");
var carritoController = require("../controllers/carrito.controller")
var authenticated = require("../middlewares/authenticated")

var user = express.Router()
user.post("/addproduct/:idUser", authenticated.ensureAuth, carritoController.addProduct);
user.post("/allproductsadded/:idUser", authenticated.ensureAuth, carritoController.allProductsAdded);
user.post("/editproductadded/:idUser/:idCarrito", authenticated.ensureAuth, carritoController.editProductAdded);
user.post("/deleteproductadded/:idUser/:idCarrito", authenticated.ensureAuth, carritoController.deleteProductAdded);

module.exports = user;