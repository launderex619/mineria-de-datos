exports.obtenerConfiguracion = async (req, res) => {
  try {
    // TODO: pendiente implementar
    res.status(200).json({
      status: 'ok',
      archivo: 'Pendiente implementar',
      parametros: req.params
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      message: err
    });
  }
};

exports.modificarConfiguracion = async (req, res) => {
  try {
    // TODO: pendiente implementar
    res.status(200).json({
      status: 'ok',
      archivo: 'Pendiente implementar',
      parametros: req.params
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      message: err
    });
  }
};
