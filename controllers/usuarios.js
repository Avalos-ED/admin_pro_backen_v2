const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async ( req, res ) => {

    const usuario = await Usuario.find({}, 'nombre, role email google');

    res.json({
        ok: true,
        usuarios: [{
            usuario
        }]
    })
}

const crearUsuarios = async( req, res = response ) => {
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email })
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario( req.body );

        // Encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password), salt;

        //Guardar usuario
        await usuario.save();

        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            token,
            usuarios: [{
                usuario
            }]
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.. revisar logs'
        })
    }
}

const actualizarUsuario = async (req, res = response) => {
    // TODO: Validar token y comprobar  si es el usuario correcto

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if ( usuarioDB.email != email ) {
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );
        usuarioActualizado.save();

        res.json({
            ok:true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inseperado al actualizar el registro'
        });
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ook: true,
            msg: 'Usuario eliminado'
        })

        res.status(200).json({
            ok: true,
            uid
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado al borrar el registro' 
        })
    }
    
}

module.exports = {
    getUsuarios,
    crearUsuarios, 
    actualizarUsuario,
    borrarUsuario
}