require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el servicod de express 
const app = express();

// Configuracion de CORS
app.use(cors());

// Base de Datos
dbConnection();

//main_user 
//6cElq7qMbCMTlRio

// Rutas
app.get( '/', ( req, res ) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
})

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
})