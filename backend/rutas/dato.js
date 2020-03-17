const express = require('express');
const datoControlador = require('../controladores/datoControlador');

const router = express.Router();

router
  .route('/:version')
  .get(datoControlador.obtenerDatos)
  .post(datoControlador.crearInstancia)
  .patch(datoControlador.modificarInstancia);

router.route('/:version/:id').delete(datoControlador.eliminarInstancia);

router.route('/:version/atributo').post(datoControlador.agregarAtributo);

router
  .route('/:version/atributo/:nombre')
  .delete(datoControlador.eliminarAtributo);

module.exports = router;
