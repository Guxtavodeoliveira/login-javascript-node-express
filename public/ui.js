 export function abrirAviso(mensagemDeAviso, tipo) {
    document.getElementById("aviso").style.display = "flex";
    document.getElementById("mensagem-aviso").innerHTML = mensagemDeAviso;
    document.getElementById("aviso").classList.remove("sucesso", "erro", "aviso");
    document.getElementById("aviso").classList.add(tipo)
}
 export function fecharAviso() {
    const buttonFechar = document.getElementById("aviso-tela");
    buttonFechar.addEventListener('click', () => {
        document.getElementById("aviso").style.display = "none";
        document.getElementById("aviso").classList.remove("sucesso", "erro", "aviso");
    })
}

export function inicializarTabs() {
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
}

export function atualizarRegra(idRegra, valido) {
    const elemento = document.getElementById(idRegra)
    const texto = elemento.getAttribute('data-texto')
    elemento.innerHTML = (valido ? '[OK] ' : '[X] ') + texto
    if (valido) {
        elemento.classList.add('valido')
    } else {
        elemento.classList.remove('valido') 
    }
}