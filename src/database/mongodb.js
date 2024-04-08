const mongoose = require('mongoose');

//CONEXION A MONGODB
const URI = process.env.mongom;
mongoose.connect(URI)
  .then(() => console.log('¡Mongodb - Conectado!'))
  .catch(err => console.error("Mongodb - Error al conectarse: ",err));

//EXPORTANDO MODULO MONGOOSE
module.exports = mongoose;