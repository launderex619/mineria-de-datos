const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

router
  .route('/:version')
  .get(dataController.getData)
  .post(dataController.addInstance)
  .patch(dataController.updateInstance);

router.route('/:version/:id').delete(dataController.deleteInstance);

router.route('/:version/atributo').post(dataController.addAtrib);

router.route('/:version/atributo/:nombre').delete(dataController.deleteAtrib);

module.exports = router;
