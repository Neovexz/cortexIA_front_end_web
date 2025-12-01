// A LISTA CENTRAL DE DADOS
// Esta variável será a fonte da verdade para todo o seu front-end.
// Ela será populada pelo Back-end via fetch.
let chamados = []; 

// =========================================================================
// VARIÁVEIS DO DOM (Modal e Navegação)
// =========================================================================
const btnNovoChamado = document.getElementById('btnNovoChamado');
const modal = document.getElementById('chatModal');
const closeBtn = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const sendBtn = document.getElementById('sendBtn');
const callTechBtn = document.getElementById('callTechBtn');
const userInput = document.getElementById('userInput');

// Variáveis do DOM da Página Chamados
const ticketList = document.getElementById("ticketList");
const ticketsContainer = document.querySelector('.tickets');
const listaChamados = document.getElementById("listaChamados");
const busca = document.getElementById("busca");
const filtroStatus = document.getElementById("filtroStatus");
const filtroPrioridade = document.getElementById("filtroPrioridade");
const filtroCategoria = document.getElementById("filtroCategoria");
const cardsTecnicos = document.getElementById("cardsTecnicos");

const tecnicos = [
    { nome: "Carlos Tech" },
    { nome: "João Tech" },
    { nome: "Roberto Support" },
];

// =========================================================================
// FUNÇÕES DE UTILIDADE E IA
// =========================================================================

const respostasIA = {
  "internet": "Parece um problema de conexão. Já tentou reiniciar o roteador?",
  "computador": "Você pode detalhar o problema do computador? Travamentos, lentidão ou erro específico?",
  "impressora": "Verifique se a impressora está ligada e conectada corretamente.",
  "login": "Tente redefinir sua senha clicando em 'Esqueci minha senha'."
};

// === Abrir / Fechar modal ===
btnNovoChamado.onclick = () => modal.style.display = 'flex';
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// === Enviar mensagem ===
sendBtn.onclick = enviarMensagem;
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') enviarMensagem(); });

function enviarMensagem() {
  const texto = userInput.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, 'user');
  userInput.value = '';

  respostaIA(texto.toLowerCase());
}

function adicionarMensagem(texto, tipo) {
  const msg = document.createElement('div');
  msg.classList.add('message', tipo);
  msg.textContent = texto;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// === IA responde com animação de digitando ===
function respostaIA(texto) {
  let resposta = null;
  callTechBtn.style.display = 'none';

  for (let chave in respostasIA) {
    if (texto.includes(chave)) {
      resposta = respostasIA[chave];
      break;
    }
  }

  const typing = document.createElement('div');
  typing.classList.add('typing');
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    chatBody.removeChild(typing);

    if (resposta) {
      adicionarMensagem(resposta, 'bot');
    } else {
      adicionarMensagem("Desculpe 😕, não consegui resolver seu problema. Deseja chamar um técnico?", 'bot');
      callTechBtn.style.display = 'inline-block';
    }
  }, 1200);
}

// === Botão "Chamar Técnico" ===
callTechBtn.onclick = () => {
  adicionarMensagem("Chamando um técnico humano...", 'bot');
  callTechBtn.style.display = 'none';
  // SIMULA CRIAÇÃO DO CHAMADO NO BACK-END AQUI
  // Ex: createTicketAPI({ tipo: "Chamado Humano" }).then(fetchChamados); 
  setTimeout(() => {
    adicionarMensagem("👨‍🔧 Um técnico foi acionado e entrará em contato em instantes.", 'bot');
  }, 2000);
};


// =========================================================================
// FLUXO PRINCIPAL DE DADOS (Fetch e Renderização)
// =========================================================================

// Função que chama todas as renderizações após um evento (fetch, filtro, mudança)
function renderAllViews() {
    updateDashboardStats(chamados);
    renderDashboardTickets(chamados); 
    renderChamados(filtrarChamados()); 
    renderTecnicos(); 
}

// FUNÇÃO CENTRAL DE BUSCA DE DADOS (Conexão com Back-end)
async function fetchChamados() {
    // 1. URL DO SEU BACK-END! MUDAR AQUI:
    const API_URL = 'http://localhost:3000/api/chamados'; 

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro de rede: status ${response.status}`);
        }
        
        chamados = await response.json(); 
        
        // 2. Garante que os campos necessários para o filtro existam
        // e harmoniza a prioridade para minuscula
        chamados = chamados.map(c => ({
            ...c,
            prioridade: c.prioridade ? c.prioridade.toLowerCase() : 'baixa',
            status: c.status ? c.status : 'Aberto',
            finalizado: c.finalizado === true // Garante que seja boolean
        }));

        renderAllViews(); 

    } catch (error) {
        console.error("Erro ao buscar dados do back-end. Renderizando estado vazio.", error);
        chamados = []; // Garante o estado vazio (renderização condicional)
        renderAllViews(); 
    }
}


// =========================================================================
// RENDERIZAÇÃO DO DASHBOARD (Cards e Lista Recente)
// =========================================================================

// tiickets do dashboard
function updateDashboardStats(allChamados) {
    const total = allChamados.length;
    const abertos = allChamados.filter(c => c.status && c.status.toLowerCase().includes('aberto')).length;
    const emAndamento = allChamados.filter(c => c.status && c.status.toLowerCase().includes('andamento')).length;
    const resolvidos = allChamados.filter(c => c.status && c.status.toLowerCase().includes('resolvido')).length;

    document.getElementById('total').textContent = total;
    document.getElementById('abertos').textContent = abertos;
    document.getElementById('andamento').textContent = emAndamento;
    document.getElementById('resolvidos').textContent = resolvidos;
}

function renderDashboardTickets(tickets) {
  ticketList.innerHTML = ""; 
  const oldEmptyMessage = ticketsContainer.querySelector('.empty-state-dashboard');
  if (oldEmptyMessage) oldEmptyMessage.remove();

  // RENDERIZAÇÃO CONDICIONAL
  if (tickets.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('empty-state-dashboard');
    emptyMessage.innerHTML = '<h4>Nenhum chamado recente criado.</h4><p>Comece clicando em "➕ Criar Novo Chamado".</p>';
    const header = ticketsContainer.querySelector('.tickets-header');
    ticketsContainer.insertBefore(emptyMessage, header.nextSibling);

  } else {
    // LOOP (FOR EACH)
    tickets.forEach((t) => {
      const li = document.createElement("li");
      li.classList.add("ticket");

      // Usando as propriedades harmonizadas: titulo, usuario, prioridade
      const statusClass = t.status.toLowerCase().replace(" ", "");
      const priorityClass = t.prioridade.toLowerCase(); 

      li.innerHTML = `
        <div>
          <strong>${t.id} - ${t.titulo}</strong><br> 
          <small>${t.usuario}</small>               
        </div>
        <div class="ticket-badges">
          <span class="badge ${statusClass}">${t.status}</span>
          <span class="badge ${priorityClass}">${t.prioridade}</span>
        </div>
      `;
      ticketList.appendChild(li);
    });
  }
}

// =========================================================================
// RENDERIZAÇÃO DA PÁGINA CHAMADOS (Filtros e Cards)
// =========================================================================

// Função para renderizar chamados
function renderChamados(lista) {
  listaChamados.innerHTML = "";

  lista.forEach(c => {
    if (c.finalizado) return;

    const li = document.createElement("li");
    li.classList.add("chamado-card");

    // ... (restante do seu código de criação do card) ...

    const statusSpan = document.createElement("span");
    statusSpan.classList.add("badge", c.status.toLowerCase().replace(" ", ""));
    statusSpan.textContent = c.status;

    const prioridadeSpan = document.createElement("span");
    prioridadeSpan.classList.add("badge", c.prioridade.toLowerCase());
    prioridadeSpan.textContent = c.prioridade;

    // ... (continua a construção do card) ...
    
    // Botão Finalizar
    const btnFinalizar = document.createElement("button");
    btnFinalizar.textContent = "✅ Finalizar";
    btnFinalizar.addEventListener("click", () => {
        // Ação: Chamar a API de alteração de status e depois buscar os dados novamente
        // Ex: updateChamadoAPI(c.id, { finalizado: true }).then(fetchChamados);
        
        // Simulação:
        c.finalizado = true;
        renderAllViews(); 
    });
    // ... (fim do card) ...
    listaChamados.appendChild(li);
  });
}

// Função para filtrar chamados (USANDO A VARIÁVEL GLOBAL 'chamados')
function filtrarChamados() {
    const texto = busca.value.toLowerCase();
    return chamados.filter(c =>
        !c.finalizado &&
        (c.titulo && c.titulo.toLowerCase().includes(texto) ||
          c.id && c.id.toLowerCase().includes(texto) ||
          c.usuario && c.usuario.toLowerCase().includes(texto) ||
          c.descricao && c.descricao.toLowerCase().includes(texto)) &&
        (filtroStatus.value === "" || c.status === filtroStatus.value) &&
        (filtroPrioridade.value === "" || c.prioridade.toLowerCase() === filtroPrioridade.value.toLowerCase()) &&
        (filtroCategoria.value === "" || c.categoria === filtroCategoria.value)
    );
}

// Eventos de filtro e busca
[busca, filtroStatus, filtroPrioridade, filtroCategoria].forEach(el => {
  // Chamamos renderChamados diretamente para a UX mais rápida de filtro
  el.addEventListener("input", () => renderChamados(filtrarChamados())); 
});

// =========================================================================
// RENDERIZAÇÃO DA PÁGINA TÉCNICOS
// =========================================================================

function contarChamadosPorTecnico(nomeTecnico) {
  const emAndamento = chamados.filter(c => c.tecnico === nomeTecnico && c.status === "Em Andamento").length;
  const resolvidos = chamados.filter(c => c.tecnico === nomeTecnico && c.status === "Resolvido").length;
  const total = chamados.filter(c => c.tecnico === nomeTecnico).length;
  return { emAndamento, resolvidos, total };
}

function renderTecnicos() {
  if (!cardsTecnicos) return;
  cardsTecnicos.innerHTML = "";
  tecnicos.forEach(t => {
    const { emAndamento, resolvidos, total } = contarChamadosPorTecnico(t.nome);
    const card = document.createElement("div");
    card.classList.add("card-tecnico");
    card.innerHTML = `
      <header>
        <div class="icon">👤</div>
        <div>
          <h3>${t.nome}</h3>
          <small>Técnico de Suporte</small>
        </div>
      </header>
      <p>Em andamento: <strong>${emAndamento}</strong></p>
      <p>Resolvidos: <strong>${resolvidos}</strong></p>
      <p>Total: <strong>${total}</strong></p>
    `;
    cardsTecnicos.appendChild(card);
  });
}


// =========================================================================
// CHAMADA INICIAL E EVENTOS GLOBAIS
// =========================================================================

// Eventos de IA (mantidos)
document.addEventListener('DOMContentLoaded', () => {
  const badges = document.querySelectorAll('.badge-ia');

  badges.forEach(button => {
    button.addEventListener('click', () => {
      const isActive = button.getAttribute('data-state') === 'active';
      const newState = isActive ? 'testing' : 'active';
      button.setAttribute('data-state', newState);
      button.setAttribute('aria-pressed', String(!isActive));
      button.textContent = newState === 'active' ? 'Ativo' : 'Em Teste';
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // ... Código do menu toggle e tabs (mantidos) ...
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');

  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  }

  const buttons = document.querySelectorAll(".nav__button");
  const sections = document.querySelectorAll(".section");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const target = button.dataset.section;
      sections.forEach(section => {
        section.classList.toggle("active", section.id === target);
      });
    });
  });
  
  // A única chamada de renderização inicial:
  fetchChamados();
});