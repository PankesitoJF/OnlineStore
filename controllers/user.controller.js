"use strict"

var User = require("../models/user.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../service/jwt");

function login(req, res){
    var params = req.body;

    User.findOne({usuario: params.usuario}, (err, obtainedUser)=>{
        if (err) return res.status(500).send({mesaje:"Error en la petición"});
        if(obtainedUser){
            bcrypt.compare(params.password, obtainedUser.password,(err,correctPass)=>{
                if(correctPass){
                    if(params.getToken === "true"){
                        return res.status(200).send({token: jwt.createToken(obtainedUser)});
                    } else{
                        obtainedUser.password=undefined;
                        return res.status(200).send({mesaje:"Token no valido"});
                    }
                }else{
                    return res.status(404).send({mesaje: "El usuario no se ha podido identificar"})
                }
            })
        }else{
            return res.status(404).send({mesaje: "El usuario no ha podido ingresar"})
        }
    })
}

function register(req, res){
    var userModel = User();
    var params = req.body

    if(params.usuario && params.email && params.password){
        User.find({$or: [
            {usuario: params.usuario},
            {email: params.email}
        ]}).exec((err, UsersFind)=>{
            if (UsersFind && UsersFind.length>=1){
                if (err) return res.status(500).send({mesaje:"Error en la petición"});
                return res.status(500).send({mesaje: "El usuario o el correo ya existen"})
            }else{
                userModel.usuario = params.usuario;
                userModel.email = params.email
                userModel.password = params.password;
                userModel.rol = "ROL_CLIENTE";
                bcrypt.hash(params.password, null, null, (err,encryptpass)=>{
                    userModel.password=encryptpass;
                    userModel.save((err,saveUser)=>{
                        if (err) return res.status(500).send({mesaje:"Error en la petición"});
                        if(saveUser){
                            return res.status(200).send({mesaje: "El usuario se creo con exito"})
                        }
                    })
                })
            }
        })
    }else{
        return res.status(500).send({mesaje: "Hacen falta datos"})
    }
}

function editUser(req, res){
    var idUser = req.params.idUser;
    var params = req.body;

    delete params.password;

    if (idUser !=req.user.sub){
        if (req.user.rol === "ROL_ADMIN"){
            if (params.usuario && params.email){
                return res.status(500).send({mesaje: "No posees los permisos necesarios para modificar esos datos"});
            }else{
                if (params.usuario) return res.status(500).send({mesaje: "No posees los permisos necesarios para modificar"});
                if (params.email) return res.status(500).send({mesaje: "No posees los permisos necesarios para modificar el correo"});
                if (params.rol && params.rol === "ROL_ADMIN"){
                    User.findByIdAndUpdate(idUser, params, {new:true}, (err, updateUser)=>{
                        if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                        if(!updateUser) return res.status(500).send({mesaje: "No se pudo actualizar el usuario"});
                        return res.status(200).send({mesaje: "Se a actualizado el rol del usuario"});
                    })
                }else{
                    return res.status(500).send({mesaje: "No existe ese rol"})
                }
            }
        }else{
            return res.status(500).send({mesaje: "No tienes los permisos necesarios"})
        }
    }else{
        if (params.usuario && params.email){
            User.find({$or: [
                {usuario: params.usuario},
                {email: params.email}
            ]}).exec((err, UsersFind)=>{
                if (err) return res.status(500).send({mesaje:"Error en la petición"});
                if (UsersFind && UsersFind.length>=1){
                    return res.status(500).send({mesaje: "Ya existe ese usuario o correo"})
                }else{
                    User.findByIdAndUpdate(idUser, params, {new:true}, (err, updateUser)=>{
                        if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                        if(!updateUser) return res.status(500).send({mesaje: "No se pudo actualizar la empresa"});
                        return res.status(200).send({updateUser});
                    })
                }
            })
        }else{
            if (params.usuario){
                User.find({$or: [
                    {usuario: params.usuario}
                ]}).exec((err, UsersFind)=>{
                    if (err) return res.status(500).send({mesaje:"Error en la petición"});
                    if (UsersFind && UsersFind.length>=1){
                        return res.status(500).send({mesaje: "Ya existe ese usuario"})
                    }else{
                        User.findByIdAndUpdate(idUser, params, {new:true}, (err, updateUser)=>{
                            if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                            if(!updateUser) return res.status(500).send({mesaje: "No se pudo actualizar la empresa"});
                            return res.status(200).send({updateUser});
                        })
                    }
                })
            }else{
                if (params.email){
                    User.find({$or: [
                        {email: params.email}
                    ]}).exec((err, UsersFind)=>{
                        if (err) return res.status(500).send({mesaje:"Error en la petición"});
                        if (UsersFind && UsersFind.length>=1){
                            return res.status(500).send({mesaje: "Ya existe ese correo"})
                        }else{
                            User.findByIdAndUpdate(idUser, params, {new:true}, (err, updateUser)=>{
                                if(err) return res.status(500).send({mesaje: "Error en la petición al actualizar"});
                                if(!updateUser) return res.status(500).send({mesaje: "No se pudo actualizar la empresa"});
                                return res.status(200).send({updateUser});
                            })
                        }
                    })
                }else{
                    return res.status(500).send({mesaje: "No hay ningún dato"})
                }
            }
        }
    }
}

function deleteUser(req, res){
    var idUser = req.params.idUser;

    if (idUser !=req.user.sub){
        return res.status(500).send({mesaje: "No posees los permisos necesarios"})
    }else{
        User.findByIdAndDelete(idUser,(err, removedEmpresa)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición al eliminar"});
            if(!removedEmpresa) return res.status(500).send({mesaje:"Error al eliminar el usuario"});
            return res.status(200).send({mesaje: "Se a logrado eliminar con exito"});
        })
    }
}

module.exports={
    register,
    login,
    editUser,
    deleteUser
}