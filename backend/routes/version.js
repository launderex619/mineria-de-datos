const express = require('express');
const versionController = require('../controllers/versionController');

const router = express.Router();

router.route('/').get(versionController.getVersions);
router.route('/ultima').get(versionController.getLast);
router.route('/actual').get(versionController.getActual);

module.exports = router;
