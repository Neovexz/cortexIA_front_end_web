// Seletores
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab.addEventListener('click', switchToLogin);
registerTab.addEventListener('click', switchToRegister);

// Trocar abas
function switchToLogin() {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
}

function switchToRegister() {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
}

/* ==========================================
   🔥 POPUP ESTILIZADO (OPÇÃO C)
========================================== */
function showPopup(title, message, isSuccess = false) {
  const popup = document.getElementById("customPopup");
  const titleEl = document.getElementById("popupTitle");
  const msgEl = document.getElementById("popupMessage");

  titleEl.innerText = title;
  msgEl.innerText = message;

  titleEl.style.color = isSuccess ? "#28a745" : "#dc3545";

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("customPopup").classList.add("hidden");
}

// ======================================
// CADASTRO (SIMULAÇÃO – SEM BACKEND)
// ======================================
async function register() {
  const nome = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const senha = document.getElementById('registerPassword').value;

  if (!nome || !email || !senha) {
    showPopup("Erro!", "Preencha todos os campos!");
    return;
  }

  localStorage.setItem("fakeUser", JSON.stringify({ nome, email, senha }));

  showPopup("Sucesso!", "Cadastro realizado!", true);

  setTimeout(() => {
    switchToLogin();
    closePopup();
  }, 1200);
}

// ======================================
// LOGIN (VALIDA PELO LOCALSTORAGE)
// ======================================
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginPassword').value;

  if (!email || !senha) {
    showPopup("Erro!", "Preencha todos os campos!");
    return;
  }

  const data = JSON.parse(localStorage.getItem("fakeUser"));

  if (!data) {
    showPopup("Erro!", "Nenhuma conta cadastrada!");
    return;
  }

  if (data.email !== email || data.senha !== senha) {
    showPopup("Erro!", "Email ou senha incorretos!");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(data));

  showPopup("Sucesso!", "Login realizado! Redirecionando...", true);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// ENTER AUTOMÁTICO
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (loginForm.classList.contains("active")) login();
    if (registerForm.classList.contains("active")) register();
  }
});
