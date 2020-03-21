const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const converter = require('json-2-csv');

exports.getData = async (req, res) => {
  try {
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    if (!propertiesFile.nombre_archivo_creado) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'Esta version no tiene un conjunto de datos asociado'
      });
    }
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    const jsonData = await csv().fromFile(datasetPath);
    res.status(200).json({
      status: 'ok',
      datos: jsonData,
      instances: jsonData.length
    });
  } catch (err) {
    res.status(500).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

const createDataset = (name, data) => {
  const datasetPath = path.resolve(`files/datasets/${name}`);
  fs.writeFileSync(datasetPath, data);
};

const updateSettings = updateName => {
  const settingsPath = path.resolve('files/settings.json');
  const settings = JSON.parse(fs.readFileSync(settingsPath));
  settings.version_counter += 1;
  settings.last_version = `${settings.version_counter}_${updateName}.json`;
  settings.actual_version = settings.last_version;
  fs.writeFileSync(settingsPath, JSON.stringify(settings));
  return `${settings.version_counter}_${updateName}`;
};

const createProperties = data => {
  const propertiesPath = path.resolve('files/properties');
  fs.writeFileSync(`${propertiesPath}/${data.version}`, JSON.stringify(data));
};

exports.addInstance = async (req, res) => {
  try {
    if (!req.body.objeto) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'El objeto dado es null o undefined'
      });
    }
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    if (!propertiesFile.nombre_archivo_creado) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'Esta version no tiene un conjunto de datos asociado'
      });
    }
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    // convierte de csv a json
    const jsonData = await csv().fromFile(datasetPath);
    // agrega al final
    jsonData.push(req.body.objeto);
    // convierte de json a csv
    const csvData = await converter.json2csvAsync(jsonData);
    // actualizo el archivo de versiones
    const name = updateSettings('agregar-instancia');
    // creo un nuevo archivo properties
    propertiesFile.version = `${name}.json`;
    propertiesFile.nombre_archivo_creado = `${name}.csv`;
    createProperties(propertiesFile);
    // guardo el dataset
    createDataset(`${name}.csv`, csvData);
    res.status(200).json({
      status: 'ok',
      mensaje: `guardado exitosamente`,
      instances: jsonData.length
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.updateInstance = async (req, res) => {
  try {
    if (!req.body.objeto || req.body.id == null || req.body.id === undefined) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'El objeto dado o el indice es null o undefined'
      });
    }
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    if (!propertiesFile.nombre_archivo_creado) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'Esta version no tiene un conjunto de datos asociado'
      });
    }
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    // convierte de csv a json
    const jsonData = await csv().fromFile(datasetPath);
    // actualizo instancia
    if (req.body.id >= jsonData.length || req.body.id < 0) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'No existe este id'
      });
    }
    jsonData[+req.body.id] = req.body.objeto;
    // convierte de json a csv
    const csvData = await converter.json2csvAsync(jsonData);
    // actualizo el archivo de versiones
    const name = updateSettings('modificar-instancia');
    // creo un nuevo archivo properties
    propertiesFile.version = `${name}.json`;
    propertiesFile.nombre_archivo_creado = `${name}.csv`;
    createProperties(propertiesFile);
    // guardo el dataset
    createDataset(`${name}.csv`, csvData);
    res.status(200).json({
      status: 'ok',
      mensaje: `actualizado exitosamente`,
      instances: jsonData.length
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.deleteInstance = async (req, res) => {
  try {
    if (req.params.id == null || req.params.id === undefined) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'El objeto dado o el indice es null o undefined'
      });
    }
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    if (!propertiesFile.nombre_archivo_creado) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'Esta version no tiene un conjunto de datos asociado'
      });
    }
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    // convierte de csv a json
    const jsonData = await csv().fromFile(datasetPath);
    // Elimino instancia
    if (req.params.id >= jsonData.length || req.params.id < 0) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'No existe este id'
      });
    }
    jsonData.splice(+req.params.id, 1);
    // convierte de json a csv
    const csvData = await converter.json2csvAsync(jsonData);
    // actualizo el archivo de versiones
    const name = updateSettings('eliminar-instancia');
    // creo un nuevo archivo properties
    propertiesFile.version = `${name}.json`;
    propertiesFile.nombre_archivo_creado = `${name}.csv`;
    createProperties(propertiesFile);
    // guardo el dataset
    createDataset(`${name}.csv`, csvData);
    res.status(200).json({
      status: 'ok',
      mensaje: `Eliminado exitosamente`,
      instances: jsonData.length
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.addAtrib = async (req, res) => {
  try {
    if (!req.body.atributo) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'El objeto dado es null o undefined'
      });
    }
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    if (!propertiesFile.nombre_archivo_creado) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'Esta version no tiene un conjunto de datos asociado'
      });
    }
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    // convierte de csv a json
    const jsonData = await csv().fromFile(datasetPath);
    const jsonReq = req.body;
    // actualizo instancia
    jsonData.map((val, index) => {
      val[jsonReq.atributo.nombre_atributo] =
        jsonReq.valor[index][jsonReq.atributo.nombre_atributo];
      return val;
    });
    // convierte de json a csv
    const csvData = await converter.json2csvAsync(jsonData);
    // actualizo el archivo de versiones
    const name = updateSettings('agregar-atributo');
    // creo un nuevo archivo properties
    propertiesFile.version = `${name}.json`;
    propertiesFile.atributos_archivo_creado.push(req.body.atributo);
    propertiesFile.nombre_archivo_creado = `${name}.csv`;
    createProperties(propertiesFile);
    // guardo el dataset
    createDataset(`${name}.csv`, csvData);
    res.status(200).json({
      status: 'ok',
      mensaje: `creado exitosamente`,
      instances: jsonData.length
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};

exports.deleteAtrib = async (req, res) => {
  try {
    if (!req.params.version || !req.params.nombre) {
      return res.status(404).json({
        status: 'fallo',
        mensaje: 'Peticion con valores erroneos'
      });
    }
    const configFilePath = `${__dirname}/../files/properties`;
    const propertiesFile = JSON.parse(
      fs.readFileSync(`${configFilePath}/${req.params.version}`)
    );
    if (!propertiesFile.nombre_archivo_creado) {
      return res.status(400).json({
        status: 'fallo',
        mensaje: 'Esta version no tiene un conjunto de datos asociado'
      });
    }
    const datasetPath = path.resolve(
      `files/datasets/${propertiesFile.nombre_archivo_creado}`
    );
    // convierte de csv a json
    const jsonData = await csv().fromFile(datasetPath);
    // actualizo instancia
    jsonData.forEach(val => {
      delete val[req.params.nombre];
    });
    // convierte de json a csv
    const csvData = await converter.json2csvAsync(jsonData);
    // actualizo el archivo de versiones
    const name = updateSettings('eliminar-atributo');
    // creo un nuevo archivo properties
    propertiesFile.version = `${name}.json`;
    propertiesFile.atributos_archivo_creado.splice(
      propertiesFile.atributos_archivo_creado.find(
        val => val === req.params.nombre
      ),
      1
    );
    propertiesFile.nombre_archivo_creado = `${name}.csv`;
    createProperties(propertiesFile);
    // guardo el dataset
    createDataset(`${name}.csv`, csvData);
    res.status(200).json({
      status: 'ok',
      mensaje: `borrado exitosamente`,
      instances: jsonData.length
    });
  } catch (err) {
    res.status(404).json({
      status: 'fallo',
      mensaje: err
    });
  }
};
