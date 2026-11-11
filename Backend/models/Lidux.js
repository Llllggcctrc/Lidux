const mongoose = require('mongoose');

// Cada registro (jogo/site) guardado no MongoDB tem estes campos
const jogoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    idadeMinima: { type: Number, required: true, min: 6, max: 12 },
    idadeMaxima: { type: Number, required: true, min: 6, max: 12 },
    dificuldade: {
      type: String,
      required: true,
      enum: ['Fácil', 'Médio', 'Difícil'],
    },
    imagem: { type: String, default: '', trim: true },
    link: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Jogo', jogoSchema);