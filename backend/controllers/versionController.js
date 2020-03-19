const fs = require('fs');

exports.getVersions = async (req, res) => {
  try {
    const versionsFolder = `${__dirname}/../files/properties`;
    fs.readdir(versionsFolder, (err, files) => {
      if (err) {
        return res.status(404).json({
          status: 'fallo',
          mensaje: err.message
        });
      }
      res.status(200).json({
        status: 'ok',
        versiones: files
      });
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.getLast = async (req, res) => {
  try {
    const configFile = `${__dirname}/../files/settings.json`;
    fs.readFile(configFile, (err, data) => {
      if (err) {
        return res.status(404).json({
          status: 'fallo',
          mensaje: err.message
        });
      }
      const settings = JSON.parse(data);
      res.status(200).json({
        status: 'ok',
        version: settings.last_version
      });
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.getActual = async (req, res) => {
  try {
    const configFile = `${__dirname}/../files/settings.json`;
    fs.readFile(configFile, (err, data) => {
      if (err) {
        return res.status(404).json({
          status: 'fallo',
          mensaje: err.message
        });
      }
      const settings = JSON.parse(data);
      res.status(200).json({
        status: 'ok',
        version: settings.actual_version
      });
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};
