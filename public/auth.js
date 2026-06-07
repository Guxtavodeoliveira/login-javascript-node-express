import { supabase } from "./supabase.js";
import { abrirAviso, atualizarRegra } from "./ui.js";

export async function verificarEmailJaCadastrado(email) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*').eq('email', email)
    if (data.length === 0) {
        return true
    } else {
        return abrirAviso("E-mail já cadastrado", "aviso");
    }
}

export async function validadorDeSenha(email, senha) {
    const minLen = senha.length >= 8
    const maxLen = senha.length <= 22
    const temMaiusc = /[A-Z]/.test(senha)
    const temNumeros = /[0-9]/.test(senha)
    const temCaract = /[!@#$]/.test(senha)
    const temMinusc = /[a-z]/.test(senha)
    const temEspaco = !/\s/.test(senha)

    if (minLen && maxLen && temMaiusc && temNumeros && temCaract && temMinusc && temEspaco) {
        const resposta = await fetch('/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha })
        })
        const resultado = await resposta.json()

        if (resultado.sucesso) {
            return abrirAviso(resultado.mensagem, "sucesso");
        } else {
            return abrirAviso(resultado.mensagem, "erro");
        }
    } else {
        return abrirAviso("A SENHA NÃO SEGUE AS REGRAS DEFINIDAS", "erro");
    }
}

export async function loginUsuario(formLogin) {
    formLogin.addEventListener('submit', async function (event) {
        event.preventDefault();

        const btnEntrar = document.querySelector('#card-entrar button[type = "submit"]')
        btnEntrar.disabled = true;
        btnEntrar.innerHTML = 'Aguarde...'

        const loginEmail = document.getElementById("login-entrar").value
        const loginSenha = document.getElementById("senha-entrar").value

        const resposta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, senha: loginSenha })
        })
        const resultado = await resposta.json()

        if (resultado.sucesso) {
            btnEntrar.disabled = false
            btnEntrar.innerHTML = 'ENTRAR'
            return abrirAviso(resultado.mensagem, 'sucesso')
        } else {
            btnEntrar.disabled = false
            btnEntrar.innerHTML = 'ENTRAR'
            return abrirAviso(resultado.mensagem, 'erro')
        }
    })
}
export function cadastroUusario(formCadastrar) {
    formCadastrar.addEventListener('submit', async function (event) {
        event.preventDefault();

        const btnCadastrar = document.querySelector('#card-cadastrar button[type="submit"]')
        btnCadastrar.disabled = true;
        btnCadastrar.innerHTML = 'Aguarde...'

        const emailDigitado = document.getElementById("login-cadastro").value
        const senhaDigitada = document.getElementById("senha-cadastro").value
        const senhaConfirmada = document.getElementById("confirmar-senha-cadastro").value

        if (await verificarEmailJaCadastrado(emailDigitado)) {
            if (senhaDigitada === senhaConfirmada) {
                btnCadastrar.disabled = false
                btnCadastrar.innerHTML = 'CADASTRAR'
                validadorDeSenha(emailDigitado, senhaDigitada);
            } else {
                btnCadastrar.disabled = false
                btnCadastrar.innerHTML = 'CADASTRAR'
                return abrirAviso("A Senha digitada não é a mesma da confirmação", "erro");
            }
        }
    })
}

export function iniciarValidacaoSenha() {
    const inputSenha = document.getElementById("senha-cadastro")
    inputSenha.addEventListener('input', () => {
        const senha = inputSenha.value
        atualizarRegra('regra-tamanho', senha.length >= 8 && senha.length <= 22)
        atualizarRegra('regra-maiuscula', /[A-Z]/.test(senha))
        atualizarRegra('regra-minuscula', /[a-z]/.test(senha))
        atualizarRegra('regra-especial', /[!@#$]/.test(senha))
        atualizarRegra('regra-numero', /[0-9]/.test(senha))
    })
}