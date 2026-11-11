// Endereço da API (o servidor Node precisa estar rodando)
const API = 'http://localhost:3000/jogos';

const form = document.getElementById('formJogo');
const lista = document.getElementById('listaJogos');
const mensagem = document.getElementById('mensagem');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

let jogos = [];

// Mostra uma mensagem de sucesso (verde) ou erro (vermelho)
function mostrarMensagem(texto, ok) {
  mensagem.textContent = texto;
  mensagem.style.color = ok ? '#1e8449' : '#c0392b';
}

// Evita que texto digitado vire código HTML
function limpar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// LISTAR
async function carregarJogos() {
  try {
    const resposta = await fetch(API);
    jogos = await resposta.json();
    desenharLista();
  } catch (erro) {
    lista.innerHTML = '<p>Não foi possível conectar à API. O servidor está ligado?</p>';
  }
}

function desenharLista() {
  if (jogos.length === 0) {
    lista.innerHTML = '<p>Nenhum registro cadastrado ainda.</p>';
    return;
  }

  lista.innerHTML = jogos.map(function (j) {
    return `
      <div class="card">
        <h3>${limpar(j.nome)}</h3>
        <p><span class="categoria">${limpar(j.categoria)}</span></p>
        <p>${limpar(j.descricao)}</p>
        <p><strong>Idade:</strong> ${j.idadeMinima} a ${j.idadeMaxima} anos
           · <strong>Dificuldade:</strong> ${limpar(j.dificuldade)}</p>
        <p><a href="${limpar(j.link)}" target="_blank">Abrir</a></p>
        <button class="botao" type="button" onclick="editar('${j._id}')">Editar</button>
        <button class="botao apagar" type="button" onclick="apagar('${j._id}')">Apagar</button>
      </div>`;
  }).join('');
}

// CADASTRAR e ALTERAR
form.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const dados = {
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    categoria: document.getElementById('categoria').value,
    idadeMinima: Number(document.getElementById('idadeMinima').value),
    idadeMaxima: Number(document.getElementById('idadeMaxima').value),
    dificuldade: document.getElementById('dificuldade').value,
    imagem: document.getElementById('imagem').value,
    link: document.getElementById('link').value
  };

  const id = document.getElementById('jogoId').value;
  const url = id ? API + '/' + id : API;
  const metodo = id ? 'PUT' : 'POST';

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      mostrarMensagem('Erro: ' + erro.erro, false);
      return;
    }

    mostrarMensagem(id ? 'Registro alterado com sucesso!' : 'Registro cadastrado com sucesso!', true);
    sairDoModoEdicao();
    carregarJogos();
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar à API.', false);
  }
});

// EDITAR: preenche o formulário com os dados do registro
function editar(id) {
  const j = jogos.find(function (item) { return item._id === id; });
  if (!j) return;

  document.getElementById('jogoId').value = j._id;
  document.getElementById('nome').value = j.nome;
  document.getElementById('descricao').value = j.descricao;
  document.getElementById('categoria').value = j.categoria;
  document.getElementById('idadeMinima').value = j.idadeMinima;
  document.getElementById('idadeMaxima').value = j.idadeMaxima;
  document.getElementById('dificuldade').value = j.dificuldade;
  document.getElementById('imagem').value = j.imagem || '';
  document.getElementById('link').value = j.link;

  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.hidden = false;
  mostrarMensagem('Editando: ' + j.nome, true);

  // abre a aba Cadastrar
  document.getElementById('aba2').checked = true;
}

function sairDoModoEdicao() {
  form.reset();
  document.getElementById('jogoId').value = '';
  btnSalvar.textContent = 'Cadastrar jogo';
  btnCancelar.hidden = true;
}

btnCancelar.addEventListener('click', function () {
  sairDoModoEdicao();
  mostrarMensagem('Edição cancelada.', true);
});

// APAGAR
async function apagar(id) {
  if (!confirm('Tem certeza que deseja apagar este registro?')) return;

  try {
    const resposta = await fetch(API + '/' + id, { method: 'DELETE' });

    if (!resposta.ok) {
      mostrarMensagem('Não foi possível apagar.', false);
      return;
    }

    mostrarMensagem('Registro apagado com sucesso!', true);
    carregarJogos();
  } catch (erro) {
    mostrarMensagem('Não foi possível conectar à API.', false);
  }
}

carregarJogos();