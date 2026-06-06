const { supabaseUrl, supabaseKey } = await fetch('/config').then(r => r.json())
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
const supabase = createClient(supabaseUrl, supabaseKey)

const entrar = document.getElementById("btn-login");
const cadastrar = document.getElementById("btn-cadastro")
const formLogin = document.getElementById("card-entrar")
const formCadastrar = document.getElementById("card-cadastrar")

entrar.addEventListener('click', () => {
    formLogin.style.display = 'flex';
    formCadastrar.style.display = 'none';
    entrar.classList.add('active')
    cadastrar.classList.remove('active')
})

cadastrar.addEventListener('click', () => {
    formCadastrar.style.display = 'flex';
    formLogin.style.display = 'none';
    entrar.classList.remove('active')
    cadastrar.classList.add('active')
})

function cadastroUusario() {
    formCadastrar.addEventListener('submit', async function (event) {
        event.preventDefault();
        const emailDigitado = document.getElementById("login-cadastro").value
        const senhaDigitada = document.getElementById("senha-cadastro").value
        const senhaConfirmada = document.getElementById("confirmar-senha-cadastro").value

        if (await verificarEmailJaCadastrado(emailDigitado)) {
            if (senhaDigitada === senhaConfirmada) {
                validadorDeSenha(emailDigitado, senhaDigitada);
            } else {
                return abrirAviso("A Senha digitada não é a mesma da confirmação", "erro");
            }
        }
    })
}

async function validadorDeSenha(email, senha) {
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
cadastroUusario();

async function loginUsuario() {
    formLogin.addEventListener('submit', async function (event) {
        event.preventDefault();
        const loginEmail = document.getElementById("login-entrar").value
        const loginSenha = document.getElementById("senha-entrar").value

        const resposta = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, senha: loginSenha })
        })
        const resultado = await resposta.json()

        if (resultado.sucesso) {
            return abrirAviso(resultado.mensagem, 'sucesso')
        } else {
            return abrirAviso(resultado.mensagem, 'erro')
        }
    })
}
loginUsuario()

async function verificarEmailJaCadastrado(email) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*').eq('email', email)
    if (data.length === 0) {
        return true
    } else {
        return abrirAviso("E-mail já cadastrado", "aviso");
    }
}

function abrirAviso(mensagemDeAviso, tipo) {
    document.getElementById("aviso").style.display = "flex";
    document.getElementById("mensagem-aviso").innerHTML = mensagemDeAviso;
    document.getElementById("aviso").classList.remove("sucesso", "erro", "aviso");
    document.getElementById("aviso").classList.add(tipo)
}

function fecharAviso() {
    const buttonFechar = document.getElementById("aviso-tela");
    buttonFechar.addEventListener('click', () => {
        document.getElementById("aviso").style.display = "none";
        document.getElementById("aviso").classList.remove("sucesso", "erro", "aviso");
    })
}
fecharAviso();