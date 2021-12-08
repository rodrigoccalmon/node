const Usuario = require("../models/Usuario");
const { NaoAutorizadoErro } = require("../erros/typeErros");
const geradorToken = require("../utils/geradorToken");
const usuarioCache = require("../cache/usuarioCache")

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
  let credencial = _criarCredencial(usuario)
  return credencial;
}
function _criarCredencial(usuario){

  let dataExpiracao = geradorToken.gerarDataExpiracao();
  let credencial = usuarioCache.obterCredencial(usuario);

  if(credencial) {
    if(credencial.dataExpiracao < new Date()) {
      usuarioCache.removerNoCache(credencial.token);
    }else{
      usuarioCache.atualizarDataExpiracao(credencial.token, dataExpiracao);
      return credencial;
    }
  }

  let token = geradorToken.criarToken(usuario);
  usuario.senha = undefined;
  let credencial = {token, usuario}
  return credencial;

}

module.exports = {
  validarUsuario,
};
