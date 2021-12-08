const Usuario = require("../models/Usuario");
const { NaoAutorizadoErro } = require("../erros/typeErros");
const geradorToken = require("../utils/geradorToken");

//1o- saber se esse usuário existe no nosso banco de dados
//2o- saber se a senha que ele passou é a correta
//3o- se a senha estiver errada, mando msg de usuario e senha inválidos.
// se estiver correta, gerar um token ou credencial e enviar para o usuário

async function validarUsuario(email, senha) {
  email = email.toString().toLowerCase();

  let usuario = await Usuario.findOne({ where: { email } });
  senha = geradorToken.gerarHashDaSenha(senha);

  if (!usuario || usuario.senha != senha) {
    throw new NaoAutorizadoErro(401, "Usuário ou senha inválidos. ");
  }
  console.log();
}

module.exports = {
  validarUsuario,
};
