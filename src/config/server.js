require("dotenv").config();
/*
require é como se fosse o import.
require dotenv config ele vai importar tudo que tem no env e vai disponibilar para usar
*/

const express = require("express");
//para trab com req http.

const cors = require("cors");
// const routes = require();

const routes = require('../../routes')

const app = express();
//app vai ser o express como se fosse uma função
//td q tenho dentro do express vou poder acessar com app.

app.use(cors());
//serve para qnd fizer requisição na api a api nao bloequeie a requisiçao no meio do caminhno. esse app.use(cors()); deixo qlqr um usar minha api

app.use(express.json({ limit: "50mb" }));

app.use(routes);


module.exports = app;
