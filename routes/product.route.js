"use strict"

var express = require("express");
var productController = require("../controllers/product.controller")
var authentication = require("../middlewares/authenticated");
var user = express.Router();

user.post("/createproduct", authentication.ensureAuth, productController.createProduct);
user.post("/products", authentication.ensureAuth, productController.Products);
user.post("/searchproducts", authentication.ensureAuth, productController.searchProducts);
user.post("/spentproduct", authentication.ensureAuth, productController.spentProduct);
user.post("/editproduct/:idProduct", authentication.ensureAuth, productController.editProduct);
user.post("/deleteproduct/:idProduct", authentication.ensureAuth, productController.deleteProduct);

module.exports = user;