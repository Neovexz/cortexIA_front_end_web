// -----------------------
// CARREGAR USUÁRIO LOGADO
// -----------------------
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
  window.location.href = "login.html";
}

// -----------------------
// NOVA FUNÇÃO salvarUsuario() — AGORA SALVA NO BANCO VIA BACKEND
// -----------------------
async function salvarUsuario() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/updateProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(usuarioLogado)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao salvar alterações!");
      return;
    }

    // Atualiza dados locais
    localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
    usuarioLogado = data.usuario;

  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor!");
  }
}

// -----------------------
// CARREGAR PERFIL
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  carregarCampos();
  carregarCard();
});

function carregarCampos() {
  document.getElementById("nome").value = usuarioLogado.nome || "";
  document.getElementById("email").value = usuarioLogado.email || "";
  document.getElementById("telefone").value = usuarioLogado.telefone || "";
  document.getElementById("nascimento").value = usuarioLogado.nascimento || "";

  document.getElementById("rua").value = usuarioLogado.rua || "";
  document.getElementById("cidade").value = usuarioLogado.cidade || "";
  document.getElementById("estado").value = usuarioLogado.estado || "";
  document.getElementById("cep").value = usuarioLogado.cep || "";

  document.getElementById("cargo").value = usuarioLogado.cargo || "";
  document.getElementById("empresa").value = usuarioLogado.empresa || "";

  document.getElementById("instagram").value = usuarioLogado.instagram || "";
  document.getElementById("linkedin").value = usuarioLogado.linkedin || "";

  if (usuarioLogado.foto) {
    document.getElementById("fotoPerfil").src = usuarioLogado.foto;
  }
}

function carregarCard() {
  document.getElementById("cardNome").innerText = usuarioLogado.nome || "";
  document.getElementById("cardEmail").innerText = usuarioLogado.email || "";
  document.getElementById("cardCargo").innerText =
    usuarioLogado.isAdmin ? "Administrador" : (usuarioLogado.cargo || "Sem cargo");
}

// -----------------------
// BOTÕES DE SALVAR
// -----------------------
document.getElementById("salvarPessoal").addEventListener("click", () => {
  usuarioLogado.nome = document.getElementById("nome").value;
  usuarioLogado.email = document.getElementById("email").value;
  usuarioLogado.telefone = document.getElementById("telefone").value;
  usuarioLogado.nascimento = document.getElementById("nascimento").value;

  salvarUsuario();
  carregarCard();
  alert("Informações pessoais salvas!");
});

document.getElementById("salvarEndereco").addEventListener("click", () => {
  usuarioLogado.rua = document.getElementById("rua").value;
  usuarioLogado.cidade = document.getElementById("cidade").value;
  usuarioLogado.estado = document.getElementById("estado").value;
  usuarioLogado.cep = document.getElementById("cep").value;

  salvarUsuario();
  alert("Endereço atualizado!");
});

document.getElementById("salvarProfissional").addEventListener("click", () => {
  usuarioLogado.cargo = document.getElementById("cargo").value;
  usuarioLogado.empresa = document.getElementById("empresa").value;

  salvarUsuario();
  carregarCard();
  alert("Informações profissionais salvas!");
});

document.getElementById("salvarSocial").addEventListener("click", () => {
  usuarioLogado.instagram = document.getElementById("instagram").value;
  usuarioLogado.linkedin = document.getElementById("linkedin").value;

  salvarUsuario();
  alert("Redes sociais salvas!");
});

// -----------------------
// FOTO DO PERFIL
// -----------------------
const uploadInput = document.getElementById("uploadFoto");
const foto = document.getElementById("fotoPerfil");

uploadInput.addEventListener("change", () => {
  const arquivo = uploadInput.files[0];
  if (arquivo) {
    const reader = new FileReader();
    reader.onload = e => {
      foto.src = e.target.result;
      usuarioLogado.foto = e.target.result;
      salvarUsuario();
    };
    reader.readAsDataURL(arquivo);
  }
});

document.getElementById("removerFoto").addEventListener("click", () => {
  foto.src = "";
  usuarioLogado.foto = "";
  salvarUsuario();
});

// -----------------------
// ABAS
// -----------------------
const abas = document.querySelectorAll(".aba");
const conteudos = document.querySelectorAll(".aba-conteudo");

abas.forEach(aba => {
  aba.addEventListener("click", () => {
    abas.forEach(a => a.classList.remove("ativa"));
    conteudos.forEach(c => c.classList.remove("ativo"));
    aba.classList.add("ativa");
    document.getElementById(aba.dataset.alvo).classList.add("ativo");
  });
});

// -----------------------
// SAIR
// -----------------------
document.getElementById("sairBtn").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// -----------------------
// VOLTAR MENU
// -----------------------
document.getElementById("voltarMenu").addEventListener("click", () => {
  window.location.href = "index.html";
});
