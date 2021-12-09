const usuarioService = require("../services/usuarioService");
const { NaoAutorizadoErro } = require("../erros/typeErros");

class UsuarioController {
 async login(req, res) {
    const { email, senha } = req.body;

    try {
      if (!email || !senha) {
        throw new NaoAutorizadoErro(401, "Usuário ou senha inválidos. ");
      }
      let credencial = await usuarioService.validarUsuario(email, senha);
      return res.json(credencial);
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req, res){
    try {
      await usuarioService.logout(req.headers.authorization);
    } catch (error) {
      console.log(error)
      return res.status(error.status).json(error);
    }
  }

  obter(req, res) {
    return res.json([{ id: 1, nome: "Rodrigo" }]);
  }
  adicionar(req, res) {}
  atualizar(req, res) {}
  inativar(req, res) {}
}

module.exports = UsuarioController;
