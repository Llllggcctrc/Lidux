const express = require('express');
const mongoose = require('mongoose');
const Jogo = require('../models/Lidux');

const router = express.Router();

// Confere se o id da URL tem o formato certo do MongoDB
function idValido(id) {
  return mongoose.isValidObjectId(id);
}

// CADASTRAR  ->  POST /jogos
router.post('/', async (req, res) => {
  try {
    const jogo = await Jogo.create(req.body);
    res.status(201).json(jogo);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

// LISTAR  ->  GET /jogos
router.get('/', async (req, res) => {
  try {
    const jogos = await Jogo.find().sort({ createdAt: -1 });
    res.json(jogos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// BUSCAR UM  ->  GET /jogos/:id
router.get('/:id', async (req, res) => {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  try {
    const jogo = await Jogo.findById(req.params.id);
    if (!jogo) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.json(jogo);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// ALTERAR  ->  PUT /jogos/:id
router.put('/:id', async (req, res) => {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  try {
    const jogo = await Jogo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jogo) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.json(jogo);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

// APAGAR  ->  DELETE /jogos/:id
router.delete('/:id', async (req, res) => {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  try {
    const jogo = await Jogo.findByIdAndDelete(req.params.id);
    if (!jogo) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.json({ mensagem: 'Registro apagado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;