const mongoose = require('mongoose');

const videojuegoSchema = new mongoose.Schema({
  Rank: {
    type: Number,
    required: [true, 'El juego debe estar rankeado'],
    unique: true
  },
  Name: {
    type: String,
    required: [true, 'El juego debe poseer un nombre']
  },
  Platform: {
    type: String,
    required: [true, 'El juego debe tener una plataforma']
  },
  Year: {
    type: Number,
    required: [true, 'El juego debio lanzarce en algún año']
  },
  Genre: {
    type: String,
    required: [true, 'El juego debe tener un genero']
  },
  Publisher: {
    type: String,
    required: [true, 'El juego debe tener un desarrollador']
  },
  NA_Sales: {
    type: Number,
    required: [
      true,
      'El juego debe tener un contador de ventas en norte america'
    ]
  },
  EU_Sales: {
    type: Number,
    required: [
      true,
      'El juego debe tener un contador de ventas en Estados unidos'
    ]
  },
  JP_Sales: {
    type: Number,
    required: [true, 'El juego debe tener un contador de ventas en Japon']
  },
  Other_Sales: {
    type: Number,
    required: [true, 'El juego debe tener un contador de ventas en algún país']
  },
  Global_Sales: {
    type: Number,
    required: [true, 'El juego debe tener un contador de ventas en el mundo']
  }
});
const Videojuego = mongoose.model('Videojuego', videojuegoSchema);

module.exports = Videojuego;
