const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
  recurso: {
    type: String,
    required: true
  },
  id_usuario: {
    type: String,
    required: true
  },
  topico: {
    type: String,
    required: true
  },
  intentos: {
    type: Number,
    required: true
  },
  revisado:{
    type: Boolean,
    default:false
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String
  },
  estado_envio:{
    type: String
  },
  subestado_envio:{
    type: String
  }
});

const Notificacion = mongoose.model('Notificacion', notiSchema);
module.exports = Notificacion;