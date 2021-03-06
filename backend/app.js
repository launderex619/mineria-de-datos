const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const versionRoutes = require('./routes/version');
const configurationRoutes = require('./routes/configuracion');
const fileRoutes = require('./routes/archivo');
const dataRoutes = require('./routes/dato');
const database = require('./routes/base-de-datos');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(`${__dirname}/public`));
app.use(fileUpload());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/versiones', versionRoutes);
app.use('/configuracion', configurationRoutes);
app.use('/archivo', fileRoutes);
app.use('/datos', dataRoutes);
app.use('/base-de-datos', database);

module.exports = app;
