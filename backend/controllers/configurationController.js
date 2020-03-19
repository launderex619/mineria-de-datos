const fs = require('fs');

exports.getConfiguration = async (req, res) => {
  try {
    const configFile = `${__dirname}/../files/properties/${req.params.version}`;
    fs.readFile(configFile, (err, data) => {
      if (err) {
        return res.status(404).json({
          status: 'fallo',
          mensaje: err.message
        });
      }
      const file = JSON.parse(data);
      res.status(200).json({
        status: 'ok',
        archivo: file
      });
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.createConfiguration = async (req, res) => {
  try {
    const config = JSON.parse(JSON.stringify(req.body));
    const settingsPath = `${__dirname}/../files/settings.json`;
    const propertiesPath = `${__dirname}/../files/properties`;

    // leer archivo settings.json
    fs.readFile(settingsPath, (err, data) => {
      if (err) {
        return res.status(404).json({
          status: 'fallo',
          mensaje: err.message
        });
      }
      const settingsFile = JSON.parse(data);
      settingsFile.version_counter += 1;
      const versionCounter = settingsFile.version_counter;
      const fileName = `${versionCounter}_nuevo-archivo-configuracion.json`;
      config.version = fileName;
      settingsFile.last_version = fileName;
      settingsFile.actual_version = fileName;

      // actualiza el archivo settings.json
      fs.writeFile(settingsPath, JSON.stringify(settingsFile), erro => {
        if (erro) {
          return res.status(404).json({
            status: 'fallo',
            mensaje: erro.message
          });
        }

        // crea un nuevo archivo en la carpeta properties
        fs.writeFile(
          `${propertiesPath}/${fileName}`,
          JSON.stringify(config),
          error => {
            if (error) {
              return res.status(404).json({
                status: 'fallo',
                mensaje: error.message
              });
            }
          }
        );
      });
      res.status(200).json({
        status: 'ok',
        mensaje: `archivo creado exitosamente: ${fileName}`
      });
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};
