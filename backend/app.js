const express = require('express');
const morgan = require('morgan');

const versionRutas = require('./rutas/version');
const configuracionRutas = require('./rutas/configuracion');

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

app.use('/versiones', versionRutas);
app.use('/configuracion', configuracionRutas);

module.exports = app;
