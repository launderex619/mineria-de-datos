const express = require('express');
const configuracionControlador = require('../controladores/configuracionControlador');

const router = express.Router();

router
  .route('/:version')
  .get(configuracionControlador.obtenerConfiguracion)
  .patch(configuracionControlador.modificarConfiguracion);

module.exports = router;
