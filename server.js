const express = require('express');
const mysql = require('mysql');
const serverless = require('serverless-http');

const app = express();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Usuario por defecto de XAMPP
  password: '', // Contraseña por defecto de XAMPP
  database: 'cms_mega_local'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Ruta para obtener las sucursales
app.get('/api/sucursales', (req, res) => {
  const query = `SELECT idSucursal, sucursalName, status 
                  FROM sucursal   
                  WHERE status = 1;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Nueva ruta para obtener los datos del tarifario//este no se ha usado
app.get('/api/tarifario/:idSucursal', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite CORS
  const { idSucursal } = req.params;
  const query = 'SELECT * FROM vistatarifario WHERE idSucursal = ? AND tipoPaquete = 3';

  connection.query(query, [idSucursal], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener los datos tarifario' });
    }
    res.json(results);
  });
});

// Ruta para obtener los banner Hero
app.get('/api/bannerHero', (req, res) => {
  const query = `SELECT * FROM bannerhome WHERE status = 1`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor banner home');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener la configuraccion de secciones activas del home
app.get('/api/configuraciones/home/', (req, res) => {
  const query = `SELECT * FROM configsecciones WHERE seccion = 'HOME'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor configuraciones');
      return;
    }
    res.json(results);
  });
});

//Ruta para obtener los datos del tarifario cuando son card doblePack
app.get('/api/doblePack/:idSucursal', (req, res) => {
  const { idSucursal } = req.params;
  const query = `SELECT t1.idTarifario, t1.idSucursal, t1.idTipoPaquete, t1.idServicioCable, t1.fibraOptica, t1.velocidadInternet, 
                  t1.telefonia, t1.precioPromoPaquete, t1.precioNormalPaquete, t1.simetria, t1.velocidadPromo, t1.tiempoVelocidaPromo, t1.tarifaPromocional, 
                  t1.status, t1.created_at, t2.sucursalName, t3.nombreTipoPaquete, t3.tipoPaquete,IFNULL(t4.nameServicioCable,0) AS nameServicioCable, 
                  t4.textoServicioCable, t5.ruta, t5.archivo 
                  FROM tarifario AS t1 
                  LEFT JOIN sucursal AS t2 on t1.idSucursal = t2.idSucursal 
                  LEFT JOIN tipodepaquete AS t3 on t1.idTipoPaquete = t3.idTipoPaquete 
                  LEFT JOIN serviciocable AS t4 on t1.idServicioCable = t4.idServicioCable 
                  LEFT JOIN banners AS t5 on t4.idBanner = t5.idBanner 
                  WHERE t1.status = 1 AND t1.idSucursal = ? AND t3.idTipoPaquete = 3;`;

  connection.query(query, [idSucursal], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener data del tarifario doblePack' });
    }
    res.json(results);
  });
});

//Ruta para obtener los datos del tarifario cuando son card triplePack
app.get('/api/triplePack/:idSucursal', (req, res) => {
  const { idSucursal } = req.params;
  const query = `SELECT t1.idTarifario, t1.idSucursal, t1.idTipoPaquete, t1.idServicioCable, t1.fibraOptica, t1.velocidadInternet, 
                  t1.telefonia, t1.precioPromoPaquete, t1.precioNormalPaquete, t1.simetria, t1.velocidadPromo, t1.tiempoVelocidaPromo, t1.tarifaPromocional, 
                  t1.status, t1.created_at, t2.sucursalName, t3.nombreTipoPaquete, t3.tipoPaquete,IFNULL(t4.nameServicioCable,0) AS nameServicioCable, 
                  t4.textoServicioCable, t5.ruta, t5.archivo 
                  FROM tarifario AS t1 
                  LEFT JOIN sucursal AS t2 on t1.idSucursal = t2.idSucursal 
                  LEFT JOIN tipodepaquete AS t3 on t1.idTipoPaquete = t3.idTipoPaquete 
                  LEFT JOIN serviciocable AS t4 on t1.idServicioCable = t4.idServicioCable 
                  LEFT JOIN banners AS t5 on t4.idBanner = t5.idBanner 
                  WHERE t1.status = 1 AND t1.idSucursal = ? AND t3.idTipoPaquete = 2;`;

  connection.query(query, [idSucursal], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener data del tarifario doblePack' });
    }
    res.json(results);
  });
});




// Exporta la aplicación para Serverless
module.exports.handler = serverless(app);