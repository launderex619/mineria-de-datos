const express = require('express');
const baseDeDatos = require('../controladores/base-de-datosControlador');

const router = express.Router();

router.route('/').get(baseDeDatos.obtenerBasesDeDatos);

router.route('/:nombre/tablas').get(baseDeDatos.obtenerTablas);

router.route('/:nombre/:tabla').get(baseDeDatos.obtenerDatos);

router.route('/:nombre/tablas/:tabla').get(baseDeDatos.obtenerAtributos);

module.exports = router;
