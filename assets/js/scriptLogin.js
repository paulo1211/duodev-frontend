document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalEsqSenha');
    const btnEmail = document.getElementById('btnGerarEmail');
    const btnCod = document.getElementById('btnVerCod');
    const btnRedefinir = document.getElementById('btnEsqSenha');
    const inputCod = document.getElementById('inputCodVer');
    const inputNovaSenha = document.getElementById('inputNovaSenha');
    const inputConfirmarSenha = document.getElementById('inputConfirmarSenha');
    const closeBtns = document.querySelectorAll('.close');
    let receivedCode = null; 

    const abrirModalEsqSenha = () => {
        modal.style.display = "block";
        setTimeout(() => modal.classList.add('show'), 10);
    };

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modalVoltaNormal();
        }, 300);
    };

    const modalVoltaNormal = () => {
        document.getElementById("conteudoDeafultModal").style.display = "flex";
        document.getElementById("soApareceQuandoMandarEmail").style.display = "none";
        document.getElementById("soApareceQuandoVerificarOCodigo").style.display = "none";
    };

    const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validarSenha = (senha) => senha.length >= 6;
    const pausa = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const displayMessage = (elementId, message) => {
        document.getElementById(elementId).textContent = message;
    };

    document.getElementById("esqSenha").addEventListener('click', abrirModalEsqSenha);

    btnCod.addEventListener("click", async () => {
        const code = inputCod.value;
        if (code === receivedCode) {
            displayMessage("msg", "Código validado");
            await pausa(3000);
            document.getElementById("soApareceQuandoVerificarOCodigo").style.display = "flex";
            document.getElementById("soApareceQuandoMandarEmail").style.display = "none";
        } else {
            displayMessage("msg", "Código inválido");
            alert("Código incorreto");
        }
    });

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    document.getElementById('inputEmail').addEventListener('input', (e) => {
        const email = e.target.value;
        e.target.classList.toggle('inputInvalidado', !validarEmail(email));
    });

    btnEmail.addEventListener("click", async () => {
        const email = document.getElementById('inputEmail').value;
        if (validarEmail(email)) {
            try {
                const response = await fetch('/api/send-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();

                if (response.ok) {
                    receivedCode = data.code; // Armazenar o código recebido do backend
                    displayMessage("msg", "Código enviado para o email");
                    await pausa(3000);
                    document.getElementById("soApareceQuandoMandarEmail").style.display = "flex";
                    document.getElementById("conteudoDeafultModal").style.display = "none";
                } else {
                    displayMessage("msg", data.message || "Erro ao enviar o email");
                }
            } catch (error) {
                console.error('Erro:', error);
                displayMessage("msg", "Erro ao enviar o email");
            }
        } else {
            displayMessage("msg", "Email inválido");
        }
    });

    btnRedefinir.addEventListener("click", async () => {
        const novaSenha = inputNovaSenha.value;
        const confirmarSenha = inputConfirmarSenha.value;

        if (validarSenha(novaSenha) && novaSenha === confirmarSenha) {
            try {
                const response = await fetch('/api/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPassword: novaSenha })
                });
                const data = await response.json();

                if (response.ok) {
                    displayMessage("msgRedefinir", "Senha redefinida com sucesso");
                    await pausa(3000);
                    closeModal();
                } else {
                    displayMessage("msgRedefinir", data.message || "Erro ao redefinir a senha");
                }
            } catch (error) {
                console.error('Erro:', error);
                displayMessage("msgRedefinir", "Erro ao redefinir a senha");
            }
        } else {
            const message = !validarSenha(novaSenha) ? "A senha deve ter no mínimo 6 caracteres" : "Senhas não coincidem";
            displayMessage("msgRedefinir", message);
        }
    });

    document.getElementById("btnFazLogin").addEventListener("click", () => {
       
        let dadosLogin = {
            email: document.getElementById("inputEmailLogin").value,
            senha: document.getElementById("inputSenhaLogin").value,
        };

        if (validarEmail(dadosLogin.email)) {
            fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin)
            })
            .then(response => response.json())
            .then(data => {
                console.log("DADOS RECEBIDOS DO FRONT" + data);
                if (data !== null) {
                   window.location.href = "escolherPerfil.html";
                } else if (response === "Usuário ou senha inválidos") {
                    alert("Email ou senha incorretos");
                }
            })
            .catch(error => console.error('Erro:', error));
        } else {
            alert("Email inválido");
        }
    });

    document.getElementById("btnFazLogin").addEventListener("click", () => {

        let dadosLogin = {
            email: document.getElementById("inputEmailLogin").value,
            senha: document.getElementById("inputSenhaLogin").value,
        };
    
    
        if (validarEmail(dadosLogin.email)) {
            fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin)
            })
            .then(response => response.json())
            .then(data => {
                console.log("DADOS RECEBIDOS DO FRONT" + data);
                if (data !== null) {
                    sessionStorage.setItem('userEmail', dadosLogin.email);  // Armazenar o email no SessionStorage
                    window.location.href = "escolherPerfil.html";
                }
                else if (response === "Usuário ou senha inválidos"){
                    alert("Email ou senha incorretos");
                }
            })
            .catch(error => console.error('Erro:', error));
        } else {
            alert("Email inválido");
        }
    });
    
});
