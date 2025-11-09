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
