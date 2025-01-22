const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

const url = "mongodb+srv://davidad:a4B36EDB@clase.6z984.mongodb.net/?retryWrites=true&w=majority&appName=CLASE";
const cliente = new MongoClient(url);
cliente.connect();
const db = cliente.db('expressback');
const coleccion = db.collection('listas');



app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

/*
const users = [
  { id: 1, nombre: "Juan", apellido: "Perez", telefono: "123456789" },
  { id: 2, nombre: "María", apellido: "Gomez", telefono: "987654320" },
  { id: 3, nombre: "Carlos", apellido: "Lopez", telefono: "456789013" },
  { id: 4, nombre: "Ana", apellido: "Martinez", telefono: "321654487" }
]
  */

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

//Listar todos
app.get("/api/users", async (req, res) =>{
  try {
    const users = await coleccion.find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }

  //res.json(users);
});


//Mostrar user1
app.get("/api/users/user1", async (req, res) =>{
  try {
    const user = await coleccion.findOne({ id: 1 });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }

  //res.json(users[0]);
});

//Buscar por ID
app.get("/api/users/:id", async (req, res) =>{
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await coleccion.findOne({ id: userId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }

  /*
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id == userId);
  if (user) {
    res.json(user)
  }else{
    res.status(404).json({ error: "Usuario no encontrado"})
  }
  */
});



//Añadir usuario
app.post('/api/users', async (req, res) => {
  const { id, nombre, apellido, telefono } = req.body;

  // Validar datos básicos
  if (!id || !nombre || !apellido || !telefono) {
    return res.status(400).json({ error: 'El ID y el nombre son requeridos.' });
  }

  try {
    await coleccion.insertOne({ id, nombre, apellido, telefono });
    res.status(201).json({ message: 'Usuario añadido exitosamente.', user: { id, nombre, apellido, telefono } });
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir el usuario' });
  }

  /*
  const { id, nombre, apellido, telefono } = req.body;

  // Validar datos básicos
  if (!id || !nombre || !apellido || !telefono) {
      return res.status(400).json({ error: 'El ID y el nombre son requeridos.' });
  }    

  users.push({ id, nombre, apellido, telefono });
  res.status(201).json({ message: 'Usuario añadido exitosamente.', user: { id, nombre, apellido, telefono } });
  */
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
