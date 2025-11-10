// Alternar abas
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

// Upload e remoção de foto
const uploadInput = document.getElementById("uploadFoto");
const foto = document.getElementById("fotoPerfil");
const removerBtn = document.getElementById("removerFoto");

uploadInput.addEventListener("change", () => {
  const arquivo = uploadInput.files[0];
  if (arquivo) {
    const reader = new FileReader();
    reader.onload = e => (foto.src = e.target.result);
    reader.readAsDataURL(arquivo);
  }
});

removerBtn.addEventListener("click", () => {
  foto.src = "";
  uploadInput.value = "";
});

// Botão voltar ao menu principal
document.getElementById("voltarMenu").addEventListener("click", () => {
  window.location.href = "index.html"; // altere se quiser outro destino
});
