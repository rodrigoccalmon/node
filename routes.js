//arquivo de rotas

const express = require('express');
const routes = express.Router();

const UsuarioController = require("./src/controllers/UsuarioController");
const usuarioController = new UsuarioController();

// Rotas do usuário
routes.post('/login', usuarioController.login);
routes.delete('/logout', usuarioController.logout);
routes.get('/usuarios/:id', usuarioController.obter);


module.exports = routes;


