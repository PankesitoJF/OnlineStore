"use strict"

const express = require("express");
const categoryController = require("../controllers/category.controller.js")

var authentication = require("../middlewares/authenticated");

var user = express.Router();
user.post("/createcategory", authentication.ensureAuth, categoryController.createCategory);
user.post("/editcategory/:idCategory", authentication.ensureAuth, categoryController.editCategory);
user.post("/deletecategory/:idCategory", authentication.ensureAuth, categoryController.deleteCategory)
user.get("/categories", categoryController.categories)

module.exports = user;