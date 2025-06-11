const express = require('express');
const sqlite3 = require('sqlite3').verbose();  // Importamos sqlite3
const shortid = require('shortid');

// Configurar el puerto
const port = 8898;

// Crear una aplicación de Express
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database('./linkshortener.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear la tabla de enlaces si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS links (
    originalUrl TEXT,
    shortUrl TEXT PRIMARY KEY
  )
`);

// Ruta para crear un link corto
app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).send('URL is required');
  }

  const shortUrl = shortid.generate();

  // Insertar el link corto en la base de datos SQLite
  db.run('INSERT INTO links (originalUrl, shortUrl) VALUES (?, ?)', [originalUrl, shortUrl], function (err) {
    if (err) {
      return res.status(500).send('Error al guardar el link');
    }
    res.json({ originalUrl, shortUrl });
  });
});

// Ruta para redirigir a la URL original
app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;

  // Buscar el link por su URL corta en la base de datos SQLite
  db.get('SELECT * FROM links WHERE shortUrl = ?', [shortUrl], (err, row) => {
    if (err) {
      return res.status(500).send('Error al buscar el link');
    }
    if (!row) {
      return res.status(404).send('Link not found');
    }
    res.redirect(row.originalUrl);
  });
});

// Iniciar el servidor en el puerto 8898
app.listen(port, () => {
  console.log(`Link Shortener listening at http://localhost:${port}`);
});

