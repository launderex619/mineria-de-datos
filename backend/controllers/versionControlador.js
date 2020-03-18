// const Videojuego = require('../modelos/videojuegoModelo');

exports.obtenerVersiones = async (req, res) => {
  try {
    // const tours = await Videojuego.find();
    // TODO: pendiente implementar
    res.status(200).json({
      status: 'ok',
      versiones: ['Pendiente implementar']
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      message: err
    });
  }
};

exports.obtenerUltima = async (req, res) => {
  try {
    // const tours = await Videojuego.find();
    // TODO: pendiente implementar
    res.status(200).json({
      status: 'ok',
      version: 'Pendiente implementar'
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      message: err
    });
  }
};

exports.obtenerActual = async (req, res) => {
  try {
    // const tours = await Videojuego.find();
    // TODO: pendiente implementar
    res.status(200).json({
      status: 'ok',
      version: 'Pendiente implementar'
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      message: err
    });
  }
};
