"use strict"

var Category = require("../models/category.model");
var Product = require("../models/product.model")

function createCategory(req, res){
    var categoryModel = Category();
    var params = req.body;

    if (req.user.rol === "ROL_ADMIN"){
        categoryModel.categoria  = params.categoria
        Category.find({categoria: params.categoria}, (err, categoryObtained)=>{
            if (err) return res.status(500).send({mesaje:"Error en la petición"});
            if (categoryObtained && categoryObtained.length>=1){
                return res.status(500).send({mesaje: "La categoría ya existe"})
            }else{
                categoryModel.save((err, saveCategory)=>{
                    if (err) return res.status(500).send({mesaje: "Error en la petición"})
                    if (!saveCategory) return res.status(500).send({mesaje: "No se a podido guardar la categoría"})
                    if (saveCategory){
                        return res.status(200).send({mesaje: "Se a creado con exito la categoría"})
                    }
                })
            }
        })
    }else{
        return res.status(500).send({mesaje: "No posees los permisos necesarios"})
    }
}

function editCategory(req, res){
    var idCategory = req.params.idCategory;
    var params = req.body;

    if (req.user.rol === "ROL_ADMIN"){
        Category.find({$or:[
            {categoria: params.categoria}
        ]}).exec((err,categoryObtained)=>{
            if (err) return res.status(500).send({mesaje:"Error en la petición"});
            if (categoryObtained && categoryObtained.length>=1){
                return res.status(500).send({mesaje: "Ya existe esa categoría"})
            }else{
                Category.findByIdAndUpdate(idCategory, params, {new:true}, (err, updateCategory)=>{
                    if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                    if(!updateCategory) return res.status(500).send({mesaje: "No se pudo actualizar la empresa"});
                    return res.status(200).send({mesaje: "La categoria se a editado correctamente"});
                })
            }
        })
    }else{
        return res.status(500).send({mesaje: "No posees los permisos necesarios"})
    }
}

function deleteCategory(req, res){
    var idCategory = req.params.idCategory;

    if (req.user.rol === "ROL_ADMIN"){
        Category.findOne({categoria: "default"}, (err, obtainedCategory)=>{
            Product.updateMany(
                {categoria: idCategory}, 
                {$set:{categoria: obtainedCategory}}, 
                {multi: true},
                function (err, result){
                    if (err) return res.status(500).send({mesaje:"Error en la petición"});
                    Category.findByIdAndDelete((idCategory), (err, categoryObtained)=>{
                        if (err) return res.status(500).send({mesaje:"Error en la petición"});
                        if (!categoryObtained) return res.status(500).send({mesaje: "No se pudo eliminar esa categoría"})
                        return res.status(200).send({mesaje: "Se a eliminado con exito la categoría"});
                    })
                })
        })
    }else{
        return res.status(500).send({mesaje: "No posees los permisos suficientes"});
    }
}

function categories(req, res){
    Category.find((err,obtainedCategories)=>{
        if(err) return res.status(500).send({mesaje: "Error al obtener usuarios"});
        if(!obtainedCategories) return res.status(500).send({mesaje: "Error al consultar usuarios"});
        return res.status(200).send(obtainedCategories);
    })
}

module.exports={
    createCategory,
    editCategory,
    deleteCategory,
    categories
}