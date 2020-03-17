const express = require('express');
const versionControlador = require('../controladores/versionControlador');

const router = express.Router();

router.route('/').get(versionControlador.obtenerVersiones);
router.route('/ultima').get(versionControlador.obtenerUltima);
router.route('/actual').get(versionControlador.obtenerActual);

module.exports = router;
