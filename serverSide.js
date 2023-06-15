const express = require('express');
const sqlite3 = require('sqlite');

const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('usuarios.db');

// Create the users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    email TEXT
  )
`);

// Middleware to parse JSON data
app.use(express.json());

// Route to fetch all users
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Route to add a new user
app.post('/usuarios', (req, res) => {
  const { nombre, email } = req.body;
  db.run('INSERT INTO users (nombre, email) VALUES (?, ?)', [nombre, email], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.send(`User added with ID: ${this.lastID}`);
    }
  });
});

// Route to update a user
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;
  db.run('UPDATE users SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      res.send('User updated');
    }
  });
});

// Route to delete a user
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      res.send('User deleted');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});