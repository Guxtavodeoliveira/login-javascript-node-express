import { cadastroUusario, loginUsuario, iniciarValidacaoSenha } from "./auth.js";
import { fecharAviso, inicializarTabs } from "./ui.js";

const formCadastrar = document.getElementById("card-cadastrar")
const formLogin = document.getElementById("card-entrar")

cadastroUusario(formCadastrar);
loginUsuario(formLogin)
fecharAviso();
inicializarTabs();
iniciarValidacaoSenha();