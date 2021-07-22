'use strict' //es una directiva que activa la ejecución de código en el modo estricto

//VARIABLES GLOBALES
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ACCESO
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//IMPORTACION DE RUTAS
var userRoutes = require('./routes/user.route');
var productRoutes = require('./routes/product.route');
var categoryRoutes = require('./routes/category.route');
var facturasRoutes = require('./routes/facturas.route');

//CARGAR RUTAS
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categorys', categoryRoutes);
app.use('/facturas', facturasRoutes);

//EXPORTAR
module.exports = app;