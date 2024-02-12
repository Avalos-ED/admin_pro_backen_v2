require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el servicod de express 
const app = express();

// Configuracion de CORS
app.use(cors());

// Lectura del body
app.use( express.json() );

// Base de Datos
dbConnection();

//main_user 
//6cElq7qMbCMTlRio

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
})