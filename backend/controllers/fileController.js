const fs = require('fs');
const path = require('path');

exports.getFile = async (req, res) => {
  try {
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    console.log(propertiesFile.nombre_archivo_creado);
    res.status(200).download(datasetPath, propertiesFile.nombre_archivo_creado);
  } catch (err) {
    res.status(500).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.postFile = async (req, res) => {
  try {
    // si no hay archivos
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'No se envio ningun archivo'
      });
    }
    // variables constantes
    const file = req.files.archivo;
    const settingsPath = `${__dirname}/../files/settings.json`;
    const configFilePath = `${__dirname}/../files/properties`;
    const datasetsPath = `${__dirname}/../files/datasets/${file.name}`;
    const settingsFile = JSON.parse(fs.readFileSync(settingsPath));
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );

    // validaciones en caso de que los archivos no sean leidos correctamente
    if (!settingsFile) {
      return res.status(500).json({
        status: 'fallo',
        mensaje: `Error en el servidor`
      });
    }
    if (!propertiesFile) {
      return res.status(500).json({
        status: 'fallo',
        mensaje: `La version ${req.params.version} no existe`
      });
    }
    // si todo sale bien, muevo el archivo a la carpeta de datasets
    file.mv(datasetsPath, err => {
      if (err) {
        return res.status(500).json({
          status: 'fallo',
          mensaje: `${err}`
        });
      }
    });
    // si el archivo properties de la version dada ya tiene un dataset asociado, creo un properties diferente,
    // si no, actualizo el dado.
    if (propertiesFile.nombre_archivo_creado) {
      settingsFile.version_counter += 1;
      settingsFile.last_version = `${settingsFile.version_counter}_nuevo_dataset.json`;
      settingsFile.actual_version = settingsFile.last_version;
      propertiesFile.nombre_archivo_creado = file.name;
      propertiesFile.version = settingsFile.actual_version;
    } else {
      propertiesFile.nombre_archivo_creado = file.name;
      settingsFile.actual_version = req.params.version;
    }
    // actualizo los archivos de configuracion
    fs.writeFileSync(settingsPath, JSON.stringify(settingsFile));
    fs.writeFileSync(
      `${configFilePath}/${settingsFile.actual_version}`,
      JSON.stringify(propertiesFile)
    );

    // envio la respuesta
    res.status(200).json({
      status: 'ok',
      mensaje: 'Archivo subido exitosamente'
    });
  } catch (err) {
    res.status(500).json({
      status: 'fallo',
      mensaje: err
    });
  }
};
