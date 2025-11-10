const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab.addEventListener('click', switchToLogin);
registerTab.addEventListener('click', switchToRegister);

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

function register() {
  const nome = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const senha = document.getElementById('registerPassword').value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // verifica se email já existe
  if (usuarios.some(u => u.email === email)) {
    alert("Este email já está cadastrado!");
    return;
  }

  usuarios.push({ nome, email, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Cadastro concluído com sucesso!");
  switchToLogin();
}

function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginPassword').value;

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    window.location.href = "index.html";
  } else {
    alert("Email ou senha incorretos!");
  }
}
