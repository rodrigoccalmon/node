//Classe que vai ter toda lógica de como funciona o usuário dentro da aplicação

const PerfilDTO = require("./PerfilDTO");

module.exports = class UsuarioDTO {
    constructor(obj) {
        obj = obj || {};
        this.id = obj.id;
        this.nome = obj.nome;
        this.email = obj.email;
        this.senha = obj.senha;
        this.perfil = obj.perfil && new PerfilDTO(obj.perfil);
        this.idPerfil = obj.idPerfil;
        this.dataInativacao = obj.dataInativacao;
        this.criadoEm = obj.criadoEm;
        this.atualizadoEm = obj.atualizadoEm;
    }
    modeloValidoCadastro() {
        return !!(this.email && this.senha && this.nome && this.idPerfil);
    }
}