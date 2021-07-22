'use strict'


var factura = require('../models/factura.model');
var product = require('../models/product.model');
var carrito = require('../models/carrito.model');

function saveFactura(req, res){
    var params = req.body;
    var factura = Factura();

    if( params.nameBusinee &&
        params.teller &&
        params.date){
            factura.nameBusinee = params.nameBusinee;
            factura.teller = params.teller;
            factura.date = params.date;

            factura.save((err, facturaSaved)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(facturaSaved){
                    res.status(200).send({facturaSaved});
                }else{
                    res.status(200).send({message: 'Error al guardar'});
                }          
            });
    }else{
        res.status(200).send({message: 'Ingrese todos los datos'});
    }
}

function totalSales(req, res){
    let facturaId = req.params.id;

        Factura.findById(facturaId, (err, facturalFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(facturaFind){

                Factura.findByIdAndUpdate(facturaFind, {$push: {total: new Number}},
                {new: true}, (err, facturaUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general 2'});
                        console.log(err);
                    }else if(facturaUpdated){
                        res.send({$mul: {Cantidad: Factura.carrito.stock, Precio: Product.price}});
                    }else{
                        res.status(418).send({message: 'Error al multiplicar'});
                    }
                }).populate('products');
            }else{
                res.status(404).send({message: 'Factura no encontrada'});
            }
        });
}

function totalv(req, res){
    Factura.update({$mul: {Cantidad: Factura.carrito.stock, Precio: Product.price}})
}

function totalSale(req, res){
    var carritoId = req.params.id;

    carrito.findById(carritoId, (err, total)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(total){
            res.status(200).send({carrito: stock * price});
        }else{ 
            res.status(200).send({message: 'No se obtuvieron datos'});
            }
    });
}

function productsOfFactura(req, res){
    var facturaId = req.params.id;

    Factura.findById(facturaId, (err, factura)=>{
        if(err){
            res.status(500).send({message: 'Error en la DB'});
        }else if(factura){
            res.send({factura});
        }else{
            res.send({message: 'No se encontro la factura'});
        }
    }).populate('carrito');
}

function setCarrito(req, res) {
    
    let facturaId = req.params.id;
    let params = req.body;
    let carrito = new carrito();
    var A = params.stock * (-1);

    Factura.findById(facturaId, (err, facturaFind)=>{
        if (err) 
            res.status(500).send({ message: 'Error general' });
        if (!facturaFind){
            res.status(500).send({ message: 'Error general 2' });
        }else{
            carrito.name = params.name;
            carrito.price = params.price;
            carrito.stock = params.stock;
            let total = parseInt(facturaFind.total) + (parseInt(params.stock) * parseInt(params.price));

            Factura.findByIdAndUpdate({_id: factutaId}, 
                { $push: { carrito: carrito},$set:{total:total}}, 
                { new: true }, (err, facturaUpdated)=>{
                if (err) {
                    res.status(500).send({ message: 'Error general 3'});
                    console.log(err);
                }else if (facturaUpdated) {
                   
                    Product.findOne({name: params.name},(err, productSelected)=>{
                        if(err)
                            res.status(500).send({message:'Error general 4'});
                         if(!productSelected){
                            res.status(500).send({ message: 'Error general 5' });
                         }else{
                            Product.findOneAndUpdate({_id: productSelected.id}, 
                                {$inc:{stock: A}}, {new:true},(err, productUpdated)=>{
                                if (err) 
                                    res.status(500).send({ message: 'Error general 20' });
                                 if (productUpdated) {
                                    res.send({factura: facturaUpdated});
                                }else{
                                    res.status(404).send({ message: 'Error al actulizar' });
                                } 
                            });
                        }
                    });
                }
            });
        } 
    });
} 

module.exports = {
    saveFactura,
    totalSale,
    productsOfFactura,
    setCarrito
}