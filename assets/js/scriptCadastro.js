document.addEventListener("DOMContentLoaded", function () {
  const switchMostraSenha = document.getElementById("showPassword");

  const btnLogin = document.getElementById("btnLogin");
  const inputs = {
    nome: document.getElementById("inputNome"),
    email: document.getElementById("inputEmail"),
    senha: document.getElementById("inputSenha"),
    confirmarSenha: document.getElementById("inputConfSenha"),
    cpf: document.getElementById("inputCPF"),
    genero: document.getElementById("selectGenero"),
    dataNascimento: document.getElementById("inputDataNascimento"),
  };

  switchMostraSenha.addEventListener("change", () => {
    if (switchMostraSenha.checked) {
      inputs.senha.type = "text";
      inputs.confirmarSenha.type = "text";
    } else {
      inputs.senha.type = "password";
      inputs.confirmarSenha.type = "password";
    }
  });

  const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validarEmail(email) {
    return regexEmail.test(email);
  }

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0,
      resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    return resto === 10 || resto === 11
      ? 0
      : resto === parseInt(cpf.substring(10, 11));
  }

  function validarSenha(senha, confirmarSenha) {
    return senha === confirmarSenha && senha.length >= 6;
  }

  function toggleClasseInvalido(elemento, condition) {
    elemento.classList.toggle("inputInvalidado", condition);
  }

  function validarEntradas() {
    let valido = true;

    if (!inputs.nome.value.trim()) {
      toggleClasseInvalido(inputs.nome, true);
      alert("O campo Nome é obrigatório.");
      valido = false;
    } else {
      toggleClasseInvalido(inputs.nome, false);
    }

    if (!validarEmail(inputs.email.value)) {
      toggleClasseInvalido(inputs.email, true);
      alert("O campo Email é inválido.");
      valido = false;
    } else {
      toggleClasseInvalido(inputs.email, false);
    }

    if (inputs.senha.value.length < 6) {
      toggleClasseInvalido(inputs.senha, true);
      alert("A senha deve ter no mínimo 6 caracteres.");
      valido = false;
    } else if (!validarSenha(inputs.senha.value, inputs.confirmarSenha.value)) {
      toggleClasseInvalido(inputs.senha, true);
      toggleClasseInvalido(inputs.confirmarSenha, true);
      alert("As senhas não coincidem.");
      valido = false;
    } else {
      toggleClasseInvalido(inputs.senha, false);
      toggleClasseInvalido(inputs.confirmarSenha, false);
    }

    if (!validarCPF(inputs.cpf.value)) {
      toggleClasseInvalido(inputs.cpf, true);
      alert("O campo CPF é inválido.");
      valido = false;
    } else {
      toggleClasseInvalido(inputs.cpf, false);
    }

    if (!inputs.genero.value.trim()) {
      toggleClasseInvalido(inputs.genero, true);
      alert("O campo Gênero é obrigatório.");
      valido = false;
    } else {
      toggleClasseInvalido(inputs.genero, false);
    }

    if (!inputs.dataNascimento.value) {
      toggleClasseInvalido(inputs.dataNascimento, true);
      alert("O campo Data de Nascimento é obrigatório.");
      valido = false;
    } else {
      toggleClasseInvalido(inputs.dataNascimento, false);
    }

    return valido;
  }

  function enviarFormulario() {
    const dados = {
      nome: inputs.nome.value,
      email: inputs.email.value,
      senha: inputs.senha.value,
      confirmarSenha: inputs.confirmarSenha.value,
      cpf: inputs.cpf.value,
      sexo: inputs.genero.value,
      dataNascimento: inputs.dataNascimento.value,
    };

    fetch("/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Erro ao cadastrar:", error));
  }

  btnLogin.addEventListener("click", async function () {
    if (validarEntradas()) {
      enviarFormulario();
      await pausa(3000);
      window.location.href = "index.html";
      console.log("Formulário válido. Enviando dados para o servidor...");
    }
  });

  inputs.cpf.addEventListener("input", function (e) {
    let cpf = e.target.value.replace(/\D/g, "");
    if (cpf.length > 11) cpf = cpf.slice(0, 11);
    cpf = cpf
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = cpf;
  });

  inputs.email.addEventListener("input", function (e) {
    toggleClasseInvalido(e.target, !validarEmail(e.target.value));
  });

  inputs.confirmarSenha.addEventListener("input", function (e) {
    toggleClasseInvalido(
      e.target,
      !validarSenha(inputs.senha.value, e.target.value)
    );
  });
});
