// VARIÁVEI GLOLBAIS
let listMsgs = [];
let listParticipantes = [];
let listParticipantesAux = [];
let pessoaSelecionada = ``;
let visibilidadeSelecionada = "";
let destinatario;
let tipoMsg;

// FUNÇÃO PARA CHAMAR O NOME

let nome;

function enviarNome() {
  nome = document.querySelector(".input-login").value;
  const search = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    { name: nome }
  );
  search.then(entrar);
  search.catch(tratarErro);
  buscarParticipantes();
}

// LOGIN

function entrar() {
  buscarMensagens();
  const input = document.querySelector(".input-login");
  const text = document.querySelector(".tela-inicial span");
  const loading = document.querySelector(".loading-screen");
  const butao = document.querySelector("button");
  input.classList.add("invisible");
  butao.classList.add("invisible");
  loading.classList.remove("invisible");
  text.classList.remove("invisible");
  setInterval(mudarTela, 3000);
  setInterval(manterConectado, 5000);
}

// MUDAR A TELA

function mudarTela() {
  document.querySelector(".tela-inicial").classList.add("invisible");
  document.querySelector(".container").classList.remove("invisible");
}

function manterConectado() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
    name: nome,
  });
}

// NOMES-REPETIDOS

function tratarErro(erro) {
  if (erro.response.status === 400) {
    alert("Nome já em uso!!");
  }
}

// FUNÇÕES DE BUSCAS

function buscarParticipantes() {
  let search = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  search.then(mostrarMensagens);
  search.catch((erro) => console.log(erro.response.data));
}

function buscarMensagens() {
  let search = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  search.then(mostrarMensagens);
  search.catch((erro) => console.log(erro.response.data));
  const showOnDisplay = document.querySelector(".scroll-folder");
  showOnDisplay.scrollIntoView();
}

// FUNÇÕES DE SHOW UP

function mostrarMensagens(resposta) {
  listMsgs = resposta.data;
  const chat = document.querySelector(".chat");
  chat.innerHTML = "";
  for (let i = 0; i < listMsgs.length; i++) {
    const msg = listMsgs[i];
    if (msg.to === "Todos" || msg.to === nome || msg.from === nome) {
      if (msg.type === "status") {
        chat.innerHTML += `
                    <div class="message-box ${msg.type}">
                        <span class="hour">(${msg.time})</span>
                        <span class="user-name">${msg.from}</span>
                        <span class="message">${msg.text}</span>
                    </div>`;
      } else {
        chat.innerHTML += `
                <div class="message-box ${msg.type}">
                    <span class="hour">(${msg.time})</span>
                    <span class="user-name">${msg.from}</span> para <span class="sender">${msg.to}:</span>
                    <span class="message">${msg.text}</span>
                    </div>`;
      }
    }
  }
}

function mostrarParticipantes(resposta) {
  listParticipantes = resposta.data;
  const participantOnline = document.querySelector(".participant-online");
  for (let i = 0; i < listParticipantes.length; i++) {
    const participante = listParticipantes[i];
    if (document.getElementById(`${participante.name}`) === null) {
      participantOnline.innerHTML += ` 
            <div class="person" id="${participante.name}" onclick="selecionar(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span>${participante.name}</span>
                <img class="check" src="./imgs/Vector.png">
            </div>`;
    }
  }

  let participantesAtivos = listParticipantes.map(
    (participante) => participante.name
  );
  let listPessoas = document.querySelectorAll(".person");
  for (let i = 1; i < listPessoas.length; i++) {
    if (participantesAtivos.indexOf(listPessoas[i].getAttribute("id")) === -1) {
      let elemento = listPessoas[i];
      elemento.parentNode.removeChild(elemento);
    }
  }
}

// FUNÇÕES ENVIAR MSG

function enviarMensagem() {
  verificaTipoMsg();
  const texto = document.querySelector(".input-send-message").value;
  document.querySelector(".input-send-message").value = "";
  let mensagem = {
    from: nome,
    to: destinatario,
    text: texto,
    type: tipoMsg,
  };
  const search = axios.post(
    `https://mock-api.driven.com.br/api/v6/uol/messages`,
    mensagem
  );

  search.then(buscarMensagens);
  search.catch((erro) => window.location.reload());
}

// MENu LATERAL

function abrirMenuLateral() {
  const telaParticipantes = document.querySelector(".display-participant");
  telaParticipantes.classList.toggle("invisible");
  verificaTipoMsg();
}
function selecionar(elemento) {
  elemento.classList.toggle("selecionado");
  if (elemento.classList.contains("person") === true) {
    let listPessoasSelecionados = document.querySelectorAll(
      ".person.selecionado"
    );
    for (let i = 0; i < listPessoasSelecionados.length; i++) {
      const selecionado = listPessoasSelecionados[i];
      if (selecionado !== elemento) {
        selecionado.classList.remove("selecionado");
      }
    }
    if (listPessoasSelecionados.length != 0) {
      pessoaSelecionada = document.querySelector(
        ".person.selecionado span"
      ).innerHTML;
    } else {
      pessoaSelecionada = "";
    }
  } else {
    let listOpcoesSelecionados = document.querySelectorAll(
      ".option.selecionado"
    );
    for (let i = 0; i < listOpcoesSelecionados.length; i++) {
      const selecionado = listOpcoesSelecionados[i];
      if (selecionado !== elemento) {
        selecionado.classList.remove("selecionado");
      }
    }
    if (listOpcoesSelecionados.length != 0) {
      visibilidadeSelecionada = document.querySelector(
        ".option.selecionado span"
      ).innerHTML;
    } else {
      visibilidadeSelecionada = "";
    }
  }
  verificaTipoMsg();
}
function verificaTipoMsg() {
  const frase = document.querySelector(".send-message span");
  if (pessoaSelecionada != "" && visibilidadeSelecionada != "") {
    frase.innerHTML = `Enviando para ${pessoaSelecionada} (${visibilidadeSelecionada})`;
    destinatario = pessoaSelecionada;
    if (visibilidadeSelecionada === "Reserve") {
      tipoMsg = "private_message";
    } else {
      tipoMsg = "message";
    }
  } else {
    destinatario = "Todos";
    tipoMsg = "message";
    frase.innerHTML = "";
  }
}
setInterval(buscarMensagens, 3000);
setInterval(buscarParticipantes, 10000);
