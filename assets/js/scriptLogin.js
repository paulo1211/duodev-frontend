document.addEventListener("DOMContentLoaded", () => {
  const SwitchMostraSenha = document.getElementById("showPassword");
  const inputSenha = document.getElementById("inputSenhaLogin");

  SwitchMostraSenha.addEventListener("change", () => {
    if (SwitchMostraSenha.checked) {
      inputSenha.type = "text";
    } else {
      inputSenha.type = "password";
    }
  });

  const mostraSenhaRedefinir = document.getElementById("showPassword2");
  

  const modal = document.getElementById("modalEsqSenha");
  const btnEmail = document.getElementById("btnGerarEmail");
  const btnCod = document.getElementById("btnVerCod");
  const btnRedefinir = document.getElementById("btnEsqSenha");
  const inputCod = document.getElementById("inputCodVer");
  const inputNovaSenha = document.getElementById("inputNovaSenha");
  const inputConfirmarSenha = document.getElementById("inputConfirmarSenha");
  const closeBtns = document.querySelectorAll(".close");
  let receivedCode = null;

  mostraSenhaRedefinir.addEventListener("change", () => {
    if (mostraSenhaRedefinir.checked) {
      inputNovaSenha.type = "text";
      inputConfirmarSenha.type = "text";
    } else {
      inputNovaSenha.type = "password";
      inputConfirmarSenha.type = "password";
    }
  });


  const abrirModalEsqSenha = () => {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
  };

  const closeModal = () => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      modalVoltaNormal();
    }, 300);
  };

  const modalVoltaNormal = () => {
    document.getElementById("conteudoDeafultModal").style.display = "flex";
    document.getElementById("soApareceQuandoMandarEmail").style.display =
      "none";
    document.getElementById("soApareceQuandoVerificarOCodigo").style.display =
      "none";
  };

  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validarSenha = (senha) => senha.length >= 6;
  const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const displayMessage = (elementId, message) => {
    document.getElementById(elementId).textContent = message;
  };

  document
    .getElementById("esqSenha")
    .addEventListener("click", abrirModalEsqSenha);

  btnCod.addEventListener("click", async () => {
    const code = inputCod.value;
    if (code === receivedCode) {
      displayMessage("msg", "Código validado");
      await pausa(3000);
      document.getElementById("soApareceQuandoVerificarOCodigo").style.display =
        "flex";
      document.getElementById("soApareceQuandoMandarEmail").style.display =
        "none";
    } else {
      displayMessage("msg", "Código inválido");
      alert("Código incorreto");
    }
  });

  closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));

  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };

  document.getElementById("inputEmail").addEventListener("input", (e) => {
    const email = e.target.value;
    e.target.classList.toggle("inputInvalidado", !validarEmail(email));
  });

  btnEmail.addEventListener("click", async () => {
    const email = document.getElementById("inputEmail").value;
    if (validarEmail(email)) {
      try {
        const response = await fetch(
          `http://localhost:8080/generateToken?email=${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.text();

        if (response.ok) {
          console.log("RETORNO BACKEND:", data);
          receivedCode = data; // Armazenar o código recebido do backend
          console.log("Código recebido: " + receivedCode);
          displayMessage("msg", "Código enviado para o email");
          await pausa(3000);
          document.getElementById("soApareceQuandoMandarEmail").style.display =
            "flex";
          document.getElementById("conteudoDeafultModal").style.display =
            "none";
        } else {
          displayMessage("msg", data.message || "Erro ao enviar o email");
        }
      } catch (error) {
        console.error("Erro:", error);
        displayMessage("msg", "Erro ao enviar o email");
      }
    } else {
      displayMessage("msg", "Email inválido");
    }
  });

  btnRedefinir.addEventListener("click", async () => {
    const senha = inputNovaSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;
    const email = document.getElementById("inputEmail").value;

    if (validarSenha(senha) && senha === confirmarSenha) {
      console.log("Senha:", senha);
      console.log("Confirmar senha:", confirmarSenha);
      console.log("Email:", email);

      dtoSenha = {
        email: email,
        senha: senha,
      };

      try {
        const response = await fetch(
          "http://localhost:8080/usuario/resetarSenha",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dtoSenha),
          }
        );
        const data = await response.text();

        if (response.ok) {
          displayMessage("msgRedefinir", "Senha redefinida com sucesso");
          await pausa(3000);
          closeModal();
        } else {
          displayMessage(
            "msgRedefinir",
            data.message || "Erro ao redefinir a senha"
          );
        }
      } catch (error) {
        console.error("Erro:", error);
        displayMessage("msgRedefinir", "Erro ao redefinir a senha");
      }
    } else {
      const message = !validarSenha(senha)
        ? "A senha deve ter no mínimo 6 caracteres"
        : "Senhas não coincidem";
      displayMessage("msgRedefinir", message);
    }
  });

  document.getElementById("btnFazLogin").addEventListener("click", () => {
    let dadosLogin = {
      email: document.getElementById("inputEmailLogin").value,
      senha: document.getElementById("inputSenhaLogin").value,
    };

    if (validarEmail(dadosLogin.email)) {
      fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLogin),
      })
        .then((response) => {
          if (response.ok) {
            //sessionStorage.setItem('usuarioLogado', dadosLogin);
            return response.json();
          } else {
            alert("Email ou senha incorretos");
            throw new Error("Email ou senha incorretos");
          }
        })
        .then((data) => {
          console.log("Sucesso:", data);
          if (data !== null) {
            sessionStorage.setItem("usuarioLogado", JSON.stringify(data));
            window.location.href = "escolherPerfil.html";
          } else {
            alert("Email ou senha incorretos");
          }
        })
        .catch((error) => console.error("Erro:", error));
    } else {
      alert("Email inválido");
    }
  });
});
