const express = require('express');
const configurationController = require('../controllers/configurationController');

const router = express.Router();

router
  .route('/:version')
  .get(configurationController.getConfiguration)
  .patch(configurationController.modifyConfiguration);

router.route('/').post(configurationController.createConfiguration);

module.exports = router;
