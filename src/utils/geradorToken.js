const md5 = require("md5");
const SECRET = "nutella";

function gerarHashDaSenha(senha) {
  return md5(`@${senha}: ${SECRET}@`);
}

module.exports = {
  gerarHashDaSenha,
};
