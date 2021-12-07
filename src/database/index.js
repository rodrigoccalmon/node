const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const connection = new Sequelize(dbConfig);

import Perfil from '../models/Perfil';

Perfil.init(connection);
module.exports = connection;