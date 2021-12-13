const Usuario = require("../models/Usuario");
const Perfil = require("../models/Perfil");
const {
  NaoAutorizadoErro,
  NaoEncontradoErro,
  AplicacaoErro,
} = require("../erros/typeErros");
const geradorToken = require("../utils/geradorToken");
const usuarioCache = require("../cache/usuarioCache");
const UsuarioDTO = require("../dtos/UsuarioDTO");
const PerfilDTO = require("../dtos/PerfilDTO");

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
  let credencial = _criarCredencial(usuario);
  return credencial;
}
function _criarCredencial(usuario) {
  let dataExpiracao = geradorToken.gerarDataExpiracao();
  let credencial = usuarioCache.obterCredencial(usuario);

  if (credencial) {
    if (credencial.dataExpiracao < new Date()) {
      usuarioCache.removerNoCache(credencial.token);
    } else {
      usuarioCache.atualizarDataExpiracao(credencial.token, dataExpiracao);
      return credencial;
    }
  }

  let token = geradorToken.criarToken(usuario);
  usuario.senha = undefined;

  credencial = { token, usuario, dataExpiracao };
  usuarioCache.adicionarNoCache(credencial);
  return credencial;
}
async function logout(token) {
  usuarioCache.removerNoCache(token);
}
async function obterPorId(id) {
  let usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new NaoEncontradoErro(
      404,
      "Não foi possível encontrar o usuário pelo id" + id
    );
  }
  usuario.senha = undefined;
  let usuarioDTO = new UsuarioDTO(usuario);
  let perfil = await Perfil.findByPk(usuario.idPerfil);
  usuarioDTO.perfil = new PerfilDTO(perfil);
  return usuario;
}
async function validarAutenticacao(token) {
  let credencial = usuarioCache.obterCredencial(token);
  if (!credencial || credencial.dataExpiracao < new Date()) {
    if (credencial) {
      usuarioCache.removerNoCache(credencial.token);
    }
    return false;
  }
  return true;
}
async function cadastrar(usuarioDTO) {
  let usuario = await Usuario.create(usuarioDTO);
  if (!usuario) {
    throw new AplicacaoErro(500, "Falha ao cadastrar o usuário. ");
  }

  return new UsuarioDTO(usuario);
}
async function atualizar(usuarioDTO) {
  let usuario = await Usuario.findByPk(usuarioDTO.id);
  if (!usuario) {
    throw new NaoEncontradoErro(404, "Usuário não localizado");
  }
  usuarioDTO.senha = usuario.senha;
  usuario = await Usuario.update(usuarioDTO, {
    where: { id: usuarioDTO.id },
  });

  if (!usuario || !usuario[0]) {
    throw new AplicacaoErro(
      500,
      "Falha ao atualizar o usuário com id:  " + usuarioDTO.id
    );
  }
  usuarioDTO.senha = undefined;
  return usuarioDTO;
}

module.exports = {
  validarUsuario,
  logout,
  obterPorId,
  validarAutenticacao,
  cadastrar,
  atualizar,
};
