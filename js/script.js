
document.addEventListener("DOMContentLoaded", function () {
    injetarEstilos();
    garantirAncoraTopo();
    iniciarMenuHamburguer();
    marcarLinkAtivo();
    iniciarBotaoTopo();
    iniciarAparecerAoRolar();
    iniciarSimuladorFluxo();
});
 

function injetarEstilos() {
    var css = `
    .menu-toggle {
        display: none;
        background: var(--azul-claro, #EAEFF2);
        color: var(--azul-escuro, #1C2C4E);
        border: 1px solid var(--borda, #E2E8F0);
        border-radius: 10px;
        padding: 8px 14px;
        font: 600 15px 'DM Sans', Arial, sans-serif;
        cursor: pointer;
    }
    .menu a.ativo {
        color: #fff;
        background: var(--gradiente-nexora, linear-gradient(135deg,#1C2C4E,#2566DA,#22C8C7));
    }
    .menu a.ativo::after { display: none; }
 
    @media (max-width: 700px) {
        header { flex-wrap: wrap; flex-direction: row; justify-content: space-between; }
        .menu-toggle { display: inline-block; }
        .menu { width: 100%; display: none; }
        .menu.aberto { display: block; }
        .menu ul { flex-direction: column; align-items: stretch; gap: 4px; }
        .menu a { text-align: center; font-size: 15px; padding: 12px; }
    }
 
    .btn-topo {
        position: fixed; right: 22px; bottom: 22px; z-index: 999;
        width: 46px; height: 46px; border: none; border-radius: 50%;
        background: var(--azul, #2566DA); color: #fff; font-size: 22px;
        cursor: pointer; box-shadow: 0 10px 30px rgba(28,44,78,.25);
        opacity: 0; visibility: hidden; transform: translateY(10px);
        transition: opacity .3s, transform .3s, visibility .3s, background .3s;
    }
    .btn-topo.visivel { opacity: 1; visibility: visible; transform: translateY(0); }
    .btn-topo:hover { background: var(--azul-escuro, #1C2C4E); }
 
    .reveal { opacity: 0; transform: translateY(24px);
              transition: opacity .7s ease, transform .7s ease; }
    .reveal.visivel { opacity: 1; transform: none; }
 
    .simulador { margin-top: 30px; padding: 24px; border-radius: 16px;
                 background: var(--azul-claro, #EAEFF2); text-align: center; }
    .simulador-botoes { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .simulador button { border: none; border-radius: 50px; padding: 12px 24px;
                        font: 600 15px 'DM Sans', Arial, sans-serif; cursor: pointer;
                        transition: transform .3s, background .3s; }
    .simulador button:hover:not(:disabled) { transform: translateY(-3px); }
    .simulador button:disabled { opacity: .5; cursor: not-allowed; }
    .btn-passo { background: var(--azul, #2566DA); color: #fff; }
    .btn-reiniciar { background: #fff; color: var(--azul-escuro, #1C2C4E);
                     border: 1px solid var(--borda, #E2E8F0); }
    .simulador-status { margin: 18px 0 0; font-weight: 600; color: var(--azul-escuro, #1C2C4E); }
    #fluxo li.passo-ativo { background: #fff; border-color: var(--turquesa, #22C8C7);
                            box-shadow: 0 10px 30px rgba(28,44,78,.16); transform: translateY(-3px); }
    #fluxo li.passo-feito { opacity: .6; }
    #fluxo li { transition: all .3s ease; }
 
    @media (prefers-reduced-motion: reduce) {
        .reveal { transition: none; opacity: 1; transform: none; }
        html { scroll-behavior: auto; }
    }`;
 
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
}
 

function garantirAncoraTopo() {
    if (!document.getElementById("topo")) {
        var header = document.querySelector("header");
        if (header) header.id = "topo";
    }
}
 

function iniciarMenuHamburguer() {
    var header = document.querySelector("header");
    var menu = document.querySelector(".menu");
    if (!header || !menu) return;
 
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "menu-toggle";
    botao.setAttribute("aria-label", "Abrir menu");
    botao.setAttribute("aria-expanded", "false");
    botao.textContent = "☰ Menu";
    header.insertBefore(botao, menu);
 
    function fechar() {
        menu.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
        botao.textContent = "☰ Menu";
    }
 
    botao.addEventListener("click", function () {
        var aberto = menu.classList.toggle("aberto");
        botao.setAttribute("aria-expanded", String(aberto));
        botao.textContent = aberto ? "✕ Fechar" : "☰ Menu";
    });
 
    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", fechar);
    });
 
    window.addEventListener("resize", function () {
        if (window.innerWidth > 700) fechar();
    });
}
 
function marcarLinkAtivo() {
    var atual = window.location.pathname.split("/").pop() || "index.html";
 
    document.querySelectorAll(".menu a").forEach(function (link) {
        var destino = link.getAttribute("href");
        if (destino === atual) {
            link.classList.add("ativo");
            link.setAttribute("aria-current", "page");
        }
    });
}
 
function iniciarBotaoTopo() {
    var botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn-topo";
    botao.setAttribute("aria-label", "Voltar ao topo");
    botao.textContent = "↑";
    document.body.appendChild(botao);
 
    window.addEventListener("scroll", function () {
        botao.classList.toggle("visivel", window.scrollY > 400);
    });
 
    botao.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
 

function iniciarAparecerAoRolar() {
    var alvos = document.querySelectorAll(
        "main section:not(.hero):not(.pagina-titulo)"
    );
    if (!alvos.length || !("IntersectionObserver" in window)) return;
 
    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1 });
 
    alvos.forEach(function (secao) {
        secao.classList.add("reveal");
        observador.observe(secao);
    });
}

function iniciarSimuladorFluxo() {
    var lista = document.querySelector("#fluxo ol");
    if (!lista) return;
 
    var passos = lista.querySelectorAll("li");
    var mensagens = [
        "Consulta criada: o atendimento foi registrado no sistema.",
        "Confirmação enviada: o paciente recebeu o aviso no aplicativo.",
        "Paciente confirmou presença antecipadamente.",
        "Recepção confirmou a chegada presencial do paciente.",
        "Paciente em espera: aguardando ser chamado pela fila.",
        "Médico iniciou o atendimento.",
        "Atendimento concluído com sucesso."
    ];
    var atual = -1;
 
    var caixa = document.createElement("div");
    caixa.className = "simulador";
    caixa.innerHTML =
        '<div class="simulador-botoes">' +
        '<button type="button" class="btn-passo">Simular próximo passo</button>' +
        '<button type="button" class="btn-reiniciar">Reiniciar</button>' +
        "</div>" +
        '<p class="simulador-status" aria-live="polite">' +
        "Clique em “Simular próximo passo” para acompanhar um atendimento.</p>";
    lista.insertAdjacentElement("afterend", caixa);
 
    var btnPasso = caixa.querySelector(".btn-passo");
    var btnReiniciar = caixa.querySelector(".btn-reiniciar");
    var status = caixa.querySelector(".simulador-status");
 
    function atualizar() {
        passos.forEach(function (li, i) {
            li.classList.toggle("passo-ativo", i === atual);
            li.classList.toggle("passo-feito", i < atual);
        });
        status.textContent = mensagens[atual] || mensagens[mensagens.length - 1];
        btnPasso.disabled = atual >= passos.length - 1;
    }
 
    btnPasso.addEventListener("click", function () {
        if (atual < passos.length - 1) {
            atual++;
            atualizar();
            passos[atual].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    });
 
    btnReiniciar.addEventListener("click", function () {
        atual = -1;
        passos.forEach(function (li) {
            li.classList.remove("passo-ativo", "passo-feito");
        });
        status.textContent =
            "Simulação reiniciada. Clique em “Simular próximo passo” para começar.";
        btnPasso.disabled = false;
    });
}
 