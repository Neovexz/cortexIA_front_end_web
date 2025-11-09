// MODAL PARA CRIAR CHAMADO
const btnNovoChamado = document.getElementById('btnNovoChamado');
const modal = document.getElementById('chatModal');
const closeBtn = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const sendBtn = document.getElementById('sendBtn');
const callTechBtn = document.getElementById('callTechBtn');
const userInput = document.getElementById('userInput');

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

  // Oculta o botão do técnico a cada nova mensagem
  callTechBtn.style.display = 'none';

  for (let chave in respostasIA) {
    if (texto.includes(chave)) {
      resposta = respostasIA[chave];
      break;
    }
  }

  // Cria indicador de "digitando..."
  const typing = document.createElement('div');
  typing.classList.add('typing');
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Depois de 1.2s remove o typing e mostra a resposta
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
  setTimeout(() => {
    adicionarMensagem("👨‍🔧 Um técnico foi acionado e entrará em contato em instantes.", 'bot');
  }, 2000);
};


// batao de navegacao do menu hamburguer

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
});

// tabs de navegacao entre secoes

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav__button");
  const sections = document.querySelectorAll(".section");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Atualiza o botão ativo
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      // Mostra a seção correspondente
      const target = button.dataset.section;
      sections.forEach(section => {
        section.classList.toggle("active", section.id === target);
      });
    });
  });
});


// tiickets do dashboard


const tickets = [
  {
    id: "#001",
    title: "Internet connection issue",
    user: "João Silva",
    status: "Aberto",
    priority: "Alto",
  },
  {
    id: "#002",
    title: "Excel won't open after update",
    user: "Maria Santos",
    status: "Em Andamento",
    priority: "Medio",
  },
  {
    id: "#003",
    title: "Printer not printing",
    user: "Pedro Costa",
    status: "Resolvido",
    priority: "Baixo",
  },
  {
    id: "#004",
    title: "Email not syncing",
    user: "Ana Oliveira",
    status: "Aberto",
    priority: "Medio",
  },
  {
    id: "#005",
    title: "Monitor flickering screen",
    user: "Roberto Lima",
    status: "Em Andamento",
    priority: "Alto",
  },
];

const ticketList = document.getElementById("ticketList");

tickets.forEach((t) => {
  const li = document.createElement("li");
  li.classList.add("ticket");

  const statusClass = t.status
    .toLowerCase()
    .replace(" ", "");

  const priorityClass = t.priority.toLowerCase();

  li.innerHTML = `
    <div>
      <strong>${t.id} - ${t.title}</strong><br>
      <small>${t.user}</small>
    </div>
    <div class="ticket-badges">
      <span class="badge ${statusClass.includes("progress") ? "progress" : statusClass}">${t.status}</span>
      <span class="badge ${priorityClass}">${t.priority}</span>
    </div>
  `;

  ticketList.appendChild(li);
});

// chamados 

const chamados = [
  { id: "#001", titulo: "Problema de conexão", descricao: "Não consigo acessar a internet", usuario: "João Silva", data: "15/01/2024, 09:00", dias: 632, status: "Aberto", prioridade: "Alta", categoria: "Rede", tecnico: "", sugestao: "Verificar rede", finalizado: false },
  { id: "#002", titulo: "Excel não abre", descricao: "Erro após atualização", usuario: "Maria Santos", data: "14/01/2024, 14:30", dias: 633, status: "Em Andamento", prioridade: "Média", categoria: "Software", tecnico: "Carlos Tech", sugestao: "Reinstalar Office", finalizado: false },
  { id: "#003", titulo: "Monitor piscando", descricao: "Apresenta piscadas constantes", usuario: "Pedro Costa", data: "13/01/2024, 10:00", dias: 640, status: "Resolvido", prioridade: "Baixa", categoria: "Hardware", tecnico: "João Tech", sugestao: "Verificar cabo de vídeo", finalizado: false }
];

const listaChamados = document.getElementById("listaChamados");
const busca = document.getElementById("busca");
const filtroStatus = document.getElementById("filtroStatus");
const filtroPrioridade = document.getElementById("filtroPrioridade");
const filtroCategoria = document.getElementById("filtroCategoria");

// Função para renderizar chamados
function renderChamados(lista) {
  listaChamados.innerHTML = "";

  lista.forEach(c => {
    if (c.finalizado) return; // Não renderiza finalizados

    const li = document.createElement("li");
    li.classList.add("chamado-card");

    // Estrutura do card
    const article = document.createElement("article");

    const header = document.createElement("header");
    header.classList.add("chamado-header");
    const h3 = document.createElement("h3");
    h3.textContent = `${c.id} - ${c.titulo}`;
    const badgesDiv = document.createElement("div");
    badgesDiv.classList.add("badges");

    const statusSpan = document.createElement("span");
    statusSpan.classList.add("badge", c.status.toLowerCase().replace(" ", ""));
    statusSpan.textContent = c.status;

    const prioridadeSpan = document.createElement("span");
    prioridadeSpan.classList.add("badge", c.prioridade.toLowerCase());
    prioridadeSpan.textContent = c.prioridade;

    badgesDiv.appendChild(statusSpan);
    badgesDiv.appendChild(prioridadeSpan);
    header.appendChild(h3);
    header.appendChild(badgesDiv);
    article.appendChild(header);

    const pDesc = document.createElement("p");
    pDesc.textContent = c.descricao;
    article.appendChild(pDesc);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("chamado-info");
    infoDiv.innerHTML = `👤 ${c.usuario} | 📅 ${c.data} | ⏱️ ${c.dias} dias`;
    article.appendChild(infoDiv);

    const sugestaoSec = document.createElement("section");
    sugestaoSec.classList.add("sugestao-ia");
    sugestaoSec.innerHTML = `<strong>💡 Sugestão da IA:</strong> ${c.sugestao}`;
    article.appendChild(sugestaoSec);

    li.appendChild(article);


    // Ações 

    const aside = document.createElement("aside");
    aside.classList.add("chamado-acoes");

    // Select Status
    const selectStatus = document.createElement("select");
    selectStatus.classList.add("alterar-status");
    ["Aberto", "Em Andamento", "Resolvido"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (c.status === status) option.selected = true;
      selectStatus.appendChild(option);
    });
    selectStatus.addEventListener("change", e => {
      c.status = e.target.value;
      renderChamados(filtrarChamados());
    });
    aside.appendChild(selectStatus);

    // Select Técnico
    const selectTecnico = document.createElement("select");
    selectTecnico.classList.add("atribuir-tecnico");
    const opcaoVazia = document.createElement("option");
    opcaoVazia.textContent = c.tecnico || "Atribuir técnico";
    selectTecnico.appendChild(opcaoVazia);
    ["João Tech", "Carlos Tech", "Roberto Support"].forEach(tecnico => {
      const option = document.createElement("option");
      option.value = tecnico;
      option.textContent = tecnico;
      selectTecnico.appendChild(option);
    });
    selectTecnico.addEventListener("change", e => {
      c.tecnico = e.target.value;
      renderChamados(filtrarChamados());
    });
    aside.appendChild(selectTecnico);

    // Botão Finalizar
    const btnFinalizar = document.createElement("button");
    btnFinalizar.textContent = "✅ Finalizar";
    btnFinalizar.addEventListener("click", () => {
      c.finalizado = true;
      renderChamados(filtrarChamados());
    });
    aside.appendChild(btnFinalizar);

    li.appendChild(aside);

    listaChamados.appendChild(li);
  });
}

// Função para filtrar chamados
function filtrarChamados() {
  const texto = busca.value.toLowerCase();
  return chamados.filter(c =>
    !c.finalizado &&
    (c.titulo.toLowerCase().includes(texto) ||
      c.id.toLowerCase().includes(texto) ||
      c.usuario.toLowerCase().includes(texto) ||
      c.descricao.toLowerCase().includes(texto)) &&
    (filtroStatus.value === "" || c.status === filtroStatus.value) &&
    (filtroPrioridade.value === "" || c.prioridade === filtroPrioridade.value) &&
    (filtroCategoria.value === "" || c.categoria === filtroCategoria.value)
  );
}

// Eventos de filtro e busca
[busca, filtroStatus, filtroPrioridade, filtroCategoria].forEach(el => {
  el.addEventListener("input", () => renderChamados(filtrarChamados()));
});

// Render inicial
renderChamados(chamados);