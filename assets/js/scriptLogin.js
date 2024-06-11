document.addEventListener('DOMContentLoaded', function() {

    var modal = document.getElementById('modalEsqSenha');
    var btnEmail = document.getElementById('btnGerarEmail');
    var btnCod = document.getElementById('btnVerCod');
    var btnRedefinir = document.getElementById('btnEsqSenha');
    var inputCod = document.getElementById('inputCodVer');
    var inputNovaSenha = document.getElementById('inputNovaSenha');
    var inputConfirmarSenha = document.getElementById('inputConfirmarSenha');
    var cod = "1234"; // Este código seria gerado e enviado pelo backend
    var closeBtns = document.querySelectorAll('.close');

    function abrirModalEsqSenha() {
        modal.style.display = "block";
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modalVoltaNormal();
        }, 300); 
    }

    function modalVoltaNormal() {
        document.getElementById("conteudoDeafultModal").style.display = "flex";
        document.getElementById("soApareceQuandoMandarEmail").style.display = "none";
        document.getElementById("soApareceQuandoVerificarOCodigo").style.display = "none";
    }

    function validarEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    document.getElementById("esqSenha").addEventListener('click', abrirModalEsqSenha);

    btnCod.addEventListener("click", async function() {
        if (inputCod.value == cod) {
            document.getElementById("msg").textContent = "Código validado";
            await pausa(3000);
            document.getElementById("soApareceQuandoVerificarOCodigo").style.display = "flex";
            document.getElementById("soApareceQuandoMandarEmail").style.display = "none";
        } else {
            document.getElementById("msg").textContent = "Código inválido";
            alert("Código incorreto");
        }
    });

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', closeModal);
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    function pausa(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    document.getElementById('inputEmail').addEventListener('input', function(e) {
        let email = e.target.value;
        if (!validarEmail(email)) {
            e.target.classList.add('inputInvalidado');
        } else {
            e.target.classList.remove('inputInvalidado');
        }
    });

    btnEmail.addEventListener("click", async function() {
        let email = document.getElementById('inputEmail').value;
        if (validarEmail(email)) {
            // Enviar código de verificação para o email
            /*
            fetch('/api/enviarCodigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("msg").textContent = "Código enviado para o email";
                    await pausa(3000);
                    document.getElementById("soApareceQuandoMandarEmail").style.display = "flex";
                    document.getElementById("conteudoDeafultModal").style.display = "none";
                } else {
                    document.getElementById("msg").textContent = "Erro ao enviar código";
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                document.getElementById("msg").textContent = "Erro ao enviar código";
            });
            */
            document.getElementById("msg").textContent = "Código enviado para o email";
            await pausa(3000);
            document.getElementById("soApareceQuandoMandarEmail").style.display = "flex";
            document.getElementById("conteudoDeafultModal").style.display = "none";
        } else {
            document.getElementById("msg").textContent = "Email inválido";
        }
    });

    btnRedefinir.addEventListener("click", async function() {
        let novaSenha = inputNovaSenha.value;
        let confirmarSenha = inputConfirmarSenha.value;

        if (novaSenha === confirmarSenha && novaSenha.length > 5) {
            // Redefinir a senha no backend
            /*
            fetch('/api/redefinirSenha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ novaSenha: novaSenha })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("msgRedefinir").textContent = "Senha redefinida com sucesso";
                    await pausa(3000);
                    closeModal();
                } else {
                    document.getElementById("msgRedefinir").textContent = "Erro ao redefinir a senha";
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                document.getElementById("msgRedefinir").textContent = "Erro ao redefinir a senha";
            });
            */
            document.getElementById("msgRedefinir").textContent = "Senha redefinida com sucesso";
            await pausa(3000);
            closeModal();
        } else {
            document.getElementById("msgRedefinir").textContent = "Senhas não coincidem ou são inválidas";
        }
    });

    document.getElementById("btnFazLogin").addEventListener("click", function() {
        var emailLogin = document.getElementById("inputEmailLogin").value;
        var senhaLogin = document.getElementById("inputSenhaLogin").value;

        if(validarEmail(emailLogin)) {
            // Autenticação do usuário
            /*
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailLogin, senha: senhaLogin })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "perfil.html";
                } else {
                    alert("Email ou senha incorretos");
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert("Erro ao fazer login");
            });
            */
            window.location.href = "perfil.html";
        } else {
            alert("Email ou senha incorretos");
        }
    });
});
