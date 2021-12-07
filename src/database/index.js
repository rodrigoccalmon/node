const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const connection = new Sequelize(dbConfig);

const Perfil = require("../models/Perfil");
const Usuario = require("../models/Usuario")

Perfil.init(connection);
Usuario.init(connection);

module.exports = connection;
