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
  const query = `SELECT idSucursal, sucursalName, status, latitud, longitud 
                  FROM sucursal   
                  WHERE status = 1
                  ORDER BY sucursalName ASC`;
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
  const query = `SELECT t1.idTarifario, t1.idSucursal, t1.idTipoPaquete, t1.idServicioCable, t1.idTipoRed, t1.velocidadInternet, 
                  t1.telefonia, t1.precioPromoPaquete, t1.precioNormalPaquete,  t1.velocidadPromo, t1.tiempoVelocidaPromo, t1.tarifaPromocional,  t1.status, t1.created_at, t2.sucursalName, t3.nombreTipoPaquete, t3.tipoPaquete,IFNULL(t4.nameServicioCable,0) AS nameServicioCable, 
                  t4.textoServicioCable, t5.ruta, t5.archivo , t1.idContrata
                  FROM tarifario AS t1 
                  LEFT JOIN sucursal AS t2 on t1.idSucursal = t2.idSucursal 
                  LEFT JOIN tipodepaquete AS t3 on t1.idTipoPaquete = t3.idTipoPaquete 
                  LEFT JOIN serviciocable AS t4 on t1.idServicioCable = t4.idServicioCable 
                  LEFT JOIN banners AS t5 on t4.idBanner = t5.idBanner
             WHERE t1.status = 1 AND t3.tipoPaquete = 2 AND t1.idSucursal = ? ;`;

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
  const query = `SELECT t1.idTarifario, t1.idSucursal, t1.idTipoPaquete, t1.idServicioCable, t1.idTipoRed, t1.velocidadInternet, 
                  t1.telefonia, t1.precioPromoPaquete, t1.precioNormalPaquete,  t1.velocidadPromo, t1.tiempoVelocidaPromo, t1.tarifaPromocional,  t1.status, t1.created_at, t2.sucursalName, t3.nombreTipoPaquete, t3.tipoPaquete,IFNULL(t4.nameServicioCable,0) AS nameServicioCable, 
                  t4.textoServicioCable, t5.ruta, t5.archivo , t1.idContrata
                  FROM tarifario AS t1 
                  LEFT JOIN sucursal AS t2 on t1.idSucursal = t2.idSucursal 
                  LEFT JOIN tipodepaquete AS t3 on t1.idTipoPaquete = t3.idTipoPaquete 
                  LEFT JOIN serviciocable AS t4 on t1.idServicioCable = t4.idServicioCable 
                  LEFT JOIN banners AS t5 on t4.idBanner = t5.idBanner
             WHERE t1.status = 1 AND t3.tipoPaquete = 3 AND t1.idSucursal = ? ;`;

  connection.query(query, [idSucursal], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener data del tarifario doblePack' });
    }
    res.json(results);
  });
});

// Ruta para obtener los banners de avisos en el home
app.get('/api/bannerFooter/', (req, res) => {
  const query = `SELECT * FROM banners WHERE tipoBanner = 5 AND status = 1;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor configuraciones');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener los banners de avisos en el home
app.get('/api/fullConnected/', (req, res) => {
  const query = `SELECT t1.idSucursal, t1.status, t2.sucursalName
                FROM tarifario  as t1
                LEFT JOIN sucursal as t2 on t1.idSucursal = t2.idSucursal
                WHERE idTipoPaquete = 5  and t1.status = 1
                ORDER BY sucursalName ASC;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor fullConnected');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener los banners de avisos en el home
app.get('/api/cardStreaming/', (req, res) => {
  const query = `SELECT * FROM cardsstreaming WHERE status = 1;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor fullConnected');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener los banners de avisos en el home
app.get('/api/tv/', (req, res) => {
  const query = `SELECT * FROM xviewsucursal;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor fullConnected');
      return;
    }
    res.json(results);
  });
});

// Ruta GET para obtener datos de todas los canales en formato JSON
app.get('/api/permisosSucursal/', (req, res) => {
  const { objetoName, idObjeto, idSucursal } = req.query;
  const query = 'SELECT * FROM permisosucursal WHERE objetoName = ? AND idObjeto = ? AND idSucursal = ?';
  const values = [objetoName, idObjeto, idSucursal];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener permisos' });
    }
    res.json(result);
  });
});


//Lambda hasta el 26-02-2025

// Ruta para obtener los banners de avisos en el home
app.get('/api/simetricoSucursal/', (req, res) => {
  const query = `SELECT idSucursal, 1 AS simetria FROM tarifario WHERE idTipoRed = 3 GROUP BY idSucursal; `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor fullConnected');
      return;
    }
    res.json(results);
  });
});
//nuevas 04-03-2025


// Ruta para obtener los banners de trivias en el home
app.get('/api/trivias/', (req, res) => {
  const query = `SELECT t1.*, t2.ruta AS rutaPrincipal , t2.archivo AS archivoPrincipal, t3.ruta AS rutaMovil, t3.archivo AS archivoMovil 
                FROM triviasconfig as t1
                LEFT JOIN banners as t2 on t1.idBannerPrincipal = t2.idBanner
                LEFT JOIN banners as t3 on t1.idBannerMovil = t3.idBanner
                 WHERE t1.status = 1;`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).send('Error en el servidor fullConnected');
      return;
    }
    res.json(results);
  });
});


// Exporta la aplicación para Serverless
module.exports.handler = serverless(app);