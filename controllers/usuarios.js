const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario')

const usuariosGet = async(req = request, res = response) => {

    // const {q, nombre = 'No name', apikey, page = 1, limit} = req.query;
    const {limite = 5, desde = 0} = req.query;

    // isNaN(limite) && (limite = 5);
    // isNaN(desde) && (desde = 0);
    // console.log(limite);
    const query = { estado: true };
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));


    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({total, usuarios});
    // res.json({
    //     msg: 'get API - Controlador',
    //     q,
    //     nombre,
    //     apikey,
    //     page,
    //     limit
    // });
}

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);
    // Guardar en BD
    await usuario.save();

    res.status(201).json(usuario);
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;

    const { _id, password, google, correo, ...resto} = req.body;

    if (password) {
         // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - Controlador',
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;

    // Borrar fisicamente al usuario
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}