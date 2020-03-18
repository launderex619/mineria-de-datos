const express = require('express');
const archivoControlador = require('../controllers/archivoControlador');

const router = express.Router();

router
  .route('/:version')
  .get(archivoControlador.obtenerArchivo)
  .post(archivoControlador.subirArchivo);

module.exports = router;
