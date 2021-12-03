class UsuarioController {
  login(req, res) {
    return res.json({ mensagem: "Usuário ou senha inválidos" });
  }
  obter(req, res) {
      return res.json([{id:1, nome: 'Rodrigo'}])
  }
  adicionar(req, res) {

  }
  atualizar(req, res) {

  }
  inativar(req, res) {
      
  }
}

module.exports = UsuarioController;
