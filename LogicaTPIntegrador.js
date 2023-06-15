//Logica del tp integrador
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 8080;


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});

app.use(express.json());
// Ruta para obtener todos los usuarios

// Crear una conexión a la base de datos SQLite
const db = new sqlite3.Database('usuarios.db');



// Crear la tabla de usuarios si no existe
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT)');
});
app.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios', (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
      } else {
        res.json(rows);
      }
    });
  });
  
  
  
  // Ruta para crear un nuevo usuario
  
  
  
  
  
  // Cerrar la conexión a la base de datos al detener el servidor
  process.on('SIGINT', () => {
    db.close((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Conexión a la base de datos cerrada');
      }
      process.exit();
    });
  });

// Función para agregar un usuario
function addUser() {
    const name = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    app.post('/usuarios', (req, res) => {
        const nombre = req.body.nombre;
        const email = req.body.email;
        const id = req.body.id; 
        db.run('INSERT INTO usuarios (id, nombre, email) VALUES (?, ?, ? )', [id,nombre, email], function (err) {
          if (err) {
            console.error(err);
            res.status(500).json({ mensaje: 'Error en el servidor' });
          } else {
            const nuevoUsuario = { id: this.lastID, nombre, email };
            res.status(201).json(nuevoUsuario);
          }
        });
      });
    // Realizar una request POST a la API REST para crear un usuario
    fetch('/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: name, email: email })
    }).then(response => response.json()).then(data => {
      // Lógica para agregar el nuevo usuario a la tabla de usuarios
      const tablaUsuarios = document.getElementById("tablaUsuarios");
      const newRow = tablaUsuarios.insertRow();
    
      const idCell = newRow.insertCell();
      const nombreCell = newRow.insertCell();
      const emailCell = newRow.insertCell();
    
      idCell.textContent = data.id;
      nombreCell.textContent = data.nombre;
      emailCell.textContent = data.email;
    
      // Limpiar el formulario
      document.getElementById('nombre').value = '';
      document.getElementById('email').value = '';


    })
    
    .catch(error => {
      console.log(error);
    });
  }
  
  function updateUser() {
    const userId = parseInt(document.getElementById('idModificar').value);
    const newName = document.getElementById('nuevoNombre').value;
    const newEmail = document.getElementById('nuevoEmail').value;
  // Ruta para actualizar un usuario específico por su ID
  app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nombre = req.body.nombre;
    const email = req.body.email;
  
    db.run('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id], function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
      } else if (this.changes > 0) {
        res.json({ mensaje: 'Usuario actualizado' });
      } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
    });
  });
    // Realiza una petición PUT a la API REST para actualizar el usuario con el ID especificado
    fetch(`/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: newName, email: newEmail })
    })
    .then(response => response.json())
    .then(data => {
      // Lógica para actualizar el usuario en la tabla de usuarios
      const rowToUpdate = document.querySelector(`#tablaUsuarios tbody tr[data-id="${userId}"]`);
      if (rowToUpdate) {
        rowToUpdate.cells[1].textContent = data.nombre;
        rowToUpdate.cells[2].textContent = data.email;
      }
    
      // Limpiar el formulario
      document.getElementById('idModificar').value = '';
      document.getElementById('nuevoNombre').value = '';
      document.getElementById('nuevoEmail').value = '';
    })
    .catch(error => {
      console.log(error);
    });
  }


//Buscar usuarios  
  function buscarUsuario() {
    const userId = parseInt(document.getElementById('idBuscar').value);
// Ruta para obtener un usuario específico por su ID
    app.get('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM usuarios WHERE id = ?', id, (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
    });
  });

    // Realiza una petición GET a la API REST para obtener el usuario con el ID especificado
    fetch(`/usuarios/${userId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Usuario no encontrado');
        }
      })
      .then(data => {
        // Mostrar el usuario en el resultado
        const resultado = document.getElementById('resultado');
        resultado.textContent = `ID: ${data.id}, Nombre: ${data.nombre}, Email: ${data.email}`;
      })
      .catch(error => {
        console.log(error);
        // Limpiar el resultado en caso de error
        const resultado = document.getElementById('resultado');
        resultado.textContent = '';
      });
  }
  


//Borrar usuario

  function deleteUser() {
    const userId = parseInt(document.getElementById('idEliminar').value);
  
    // Ruta para eliminar un usuario específico por su ID
    app.delete('/usuarios/:id', (req, res) => {
        const id = parseInt(req.params.id);
  
        db.run('DELETE FROM usuarios WHERE id = ?', id, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ mensaje: 'Error en el servidor' });
        } else if (this.changes > 0) {
            res.json({ mensaje: 'Usuario eliminado' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        });
     });
    
    
     // Realizar una petición DELETE a la API REST para eliminar el usuario con el ID especificado
    fetch(`/usuarios/${userId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // Lógica para eliminar el usuario de la tabla de usuarios
        const rowToRemove = document.querySelector(`#tablaUsuarios tbody tr[data-id="${userId}"]`);
        if (rowToRemove) {
          rowToRemove.remove();
        }
    
        // Limpiar el formulario
        document.getElementById('idEliminar').value = '';
      } else {
        throw new Error('Error al eliminar el usuario');
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  function mostrarAgregarUsuario() {
    document.getElementById('nombre').style.display = 'block';
    document.getElementById('email').style.display = 'block';
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('add-button').style.display = '';
  }
  
  function mostrarModificarUsuario() {
    document.getElementById('idModificar').style.display = 'block';
    document.getElementById('nuevoNombre').style.display = 'block';
    document.getElementById('nuevoEmail').style.display = 'block';
    document.getElementById('idModificar').value = '';
    document.getElementById('nuevoNombre').value = '';
    document.getElementById('nuevoEmail').value = '';
    document.getElementById('modify-button').style.display = 'block';
  }
  
  function mostrarEliminarUsuario() {
    document.getElementById('idEliminar').style.display = 'block';
    document.getElementById('idEliminar').value = '';
    document.getElementById('delete-button').style.display = 'block';
  }
  
  function mostrarBuscarUsuario() {
  document.getElementById('idBuscar').style.display = 'block';
  document.getElementById('idBuscar').value= '';
  document.getElementById('read-button').style.display = 'block';
  }
  
  
  function guardarReporte() {
    const errorReport = document.getElementById('reporteErrores').value;
  
    // Send the error report to the server or perform any desired action
    // For example, you can make a POST request to a server-side endpoint to save the report
    fetch('/guardar-reporte', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ report: errorReport })
    })
    .then(response => {
      if (response.ok) {
        // Clear the error report textarea
        document.getElementById('reporteErrores').value = '';
        alert('Reporte guardado correctamente.');
      } else {
        throw new Error('Error al guardar el reporte.');
      }
    })
    .catch(error => {
      console.log(error);
      alert('Ocurrió un error al guardar el reporte.');
    });
  }