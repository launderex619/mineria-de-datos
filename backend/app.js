const express = require('express');
const morgan = require('morgan');

const versionRoutes = require('./routes/version');
const configuracionRoutes = require('./routes/configuracion');
const archivoRoutes = require('./routes/archivo');
const datoRoutes = require('./routes/dato');
const database = require('./routes/base-de-datos');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  // pendiente para guardar siempre a archivo o hacerlo en otro lado
  console.log('Pendiente implementar guardados o algun sistema de logs');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/versiones', versionRoutes);
app.use('/configuracion', configuracionRoutes);
app.use('/archivo', archivoRoutes);
app.use('/datos', datoRoutes);
app.use('/base-de-datos', database);

module.exports = app;
