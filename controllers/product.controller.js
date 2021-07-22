"use strict"

var Product = require("../models/product.model")
function createProduct(req, res){
    var productModel = Product();
    var params = req.body;

    if (req.user.rol === "ROL_ADMIN"){
        productModel.producto = params.producto;
        productModel.stock = params.stock;
        productModel.precio = params.precio;
        productModel.ventas = 0;
        productModel.categoria = params.categoria;
        productModel.estado = "ACTIVO"
        productModel.save((err,saveProduct)=>{
            if (err) return res.status(500).send({mesaje: "Error en la petición"});
            if(saveProduct){
                return res.status(200).send({mesaje: "El producto se creo con exito"})
            }else{
                return res.status(500).send({mesaje: "No se logro guardar el producto"});
            }
        })
    }else{
        return res.status(500).send({mesaje: "No posees los permisos necesarios"});
    }
}

function Products(req, res){
    Product.find((err,obtainedProduct)=>{
        if(err) return res.status(500).send({mesaje: "Error al obtener productos"});
        if(!obtainedProduct) return res.status(500).send({mesaje: "Error al consultar los productos"});
        return res.status(200).send(obtainedProduct);
    })
}

function searchProducts(req, res){
    var params = req.body;

    if(params.producto){
        Product.find({$or: [
            {producto: params.producto}
        ]}).exec((err, ProductsFind)=>{
            if (err) return res.status(500).send({mesaje: "Error al buscar producto"})
            if (ProductsFind.length>=1){
                return res.status(200).send(ProductsFind);  
            }else{
                return res.status(500).send({mesaje: "No existe ningún producto con ese nombre"})
            }
        })
    }else{
        if (params.categoria){
            Product.find({$or: [
                {categoria: params.categoria}
            ]}).exec((err, ProductsFind)=>{
                if (err) return res.status(500).send({mesaje: "Error al buscar producto"})
                if (!ProductsFind) return res.status(500).send({mesaje: "No existe esa categoria"})
                return res.status(200).send(ProductsFind);
            })
        }else{
            if (params.producto && params.categoria){
                Product.find({$or: [
                    {producto: params.producto},
                    {categoria: params.categoria}
                ]}).exec((err, ProductsFind)=>{
                    if (ProductsFind.length>=1){
                        if (err) return res.status(500).send({mesaje: "Error al buscar producto"})
                        if (!ProductsFind) return res.status(500).send({mesaje: ""})
                        return res.status(200).send(ProductsFind);  
                    }else{
                        return res.status(500).send({mesaje: "No existe ningún producto con esos datos"})
                    }
                })
            }else{
                return res.status(500).send({mesaje: "Faltan datos para la busqueda"})
            }
        }
    }
}

function spentProduct(req, res){

    Product.find({$or: [
        {stock: 0}
    ]}).exec((err, ProductsFind)=>{
        if (err) return res.status(500).send({mesaje: "Error al buscar producto"})
        if (!ProductsFind) return res.status(500).send({mesaje: "No existe esa categoria"})
        return res.status(200).send(ProductsFind);
    })
}

function editProduct(req, res){
    var idProduct = req.params.idProduct
    var params = req.body

    if (req.user.rol === "ROL_ADMIN"){
        if (params.stock>=1){
            params.estado = "ACTIVO"
            Product.findByIdAndUpdate(idProduct, params, {new:true}, (err, updateProduct)=>{
                if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                if(!updateProduct) return res.status(500).send({mesaje: "No se pudo actualizar el producto"});
                return res.status(200).send({mesaje: "Se a actualizado el producto"});
            })
        }else{
            params.estado = "INACTIVO"
            Product.findByIdAndUpdate(idProduct, params, {new:true}, (err, updateProduct)=>{
                if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                if(!updateProduct) return res.status(500).send({mesaje: "No se pudo actualizar "});
                return res.status(200).send({mesaje: "Se a actualizado el producto"});
            })
        }
    }else{
        return res.status(500).send({mesaje: "No posees los permisos necesarios"});
    }
}

function deleteProduct(req, res){
    var idProduct = req.params.idProduct

    if (req.user.rol === "ROL_ADMIN"){
        Product.findByIdAndDelete(idProduct,(err, removedProduct)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición al eliminar"});
            if(!removedProduct) return res.status(500).send({mesaje:"Error al eliminar la empresa"});
            return res.status(200).send({mesaje: "Se a logrado eliminar con exito"});
        })
    }else{
        return res.status(500).send({mesaje: "No posees los permisos necesarios"});
    }
}

module.exports={
    createProduct,
    Products,
    searchProducts,
    spentProduct,
    editProduct,
    deleteProduct
}