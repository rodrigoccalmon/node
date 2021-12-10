//arquivo de rotas

const express = require('express');
const { noExtendLeft } = require('sequelize/dist/lib/operators');
const routes = express.Router();
const usuarioService = require('./src/services/usuarioService');

const UsuarioController = require("./src/controllers/UsuarioController");
const usuarioController = new UsuarioController();

routes.use(async (req, res, next) => {
    const { authorization } = req.headers;
    let autenticado = await usuarioService.validarAutenticacao(authorization)

    if(!autenticado && req.originalUrl != '/login') {
        return res.status(401).json({ 
            status:  401,
            message: 'Usuário não autenticado',
            name: 'NaoAutorizado'})
    }
    next()
})

// Rotas do usuário
routes.post('/login', usuarioController.login);
routes.delete('/logout', usuarioController.logout);
routes.get('/usuarios/:id', usuarioController.obterPorId);
routes.post("/usuarios", usuarioController.cadastrar);


module.exports = routes;


