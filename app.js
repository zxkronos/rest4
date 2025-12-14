require('dotenv').config();
const interval = require('./interval');
const Server = require('./models/server');
const mongoose = require('mongoose');

// URL de conexión a la base de datos de MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbCollection = process.env.DB_COLLECTION;

const dbUrl = `mongodb+srv://${dbUser}:${dbPassword}@cluster1.lw9kp3j.mongodb.net/${dbCollection}?retryWrites=true&w=majority`;

// Opciones de conexión a MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Conexión a la base de datos
mongoose.connect(dbUrl, options)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    //interval.start(); 
    //interval.enviarItemDataverse();
    //interval.prueba();
    //interval.enviarOrdenDataverse();
    //interval.eliminarRegistros();
    //interval.enviarEnvioDataverse();
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos', error);
  });


const server = new Server();



 
server.listen();