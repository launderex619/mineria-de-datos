const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router
  .route('/:version')
  .get(fileController.getFile)
  .post(fileController.postFile);

module.exports = router;
