document.addEventListener('DOMContentLoaded', function() {

    var modal = document.getElementById('modalEsqSenha');
    var btnEmail = document.getElementById('btnGerarEmail');
    var btnCod = document.getElementById('btnVerCod');
    var inputCod = document.getElementById('inputCodVer');
    var cod = "1234";
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
            document.getElementById("msg").textContent = "Código enviado para o email";
            await pausa(3000);
            document.getElementById("soApareceQuandoMandarEmail").style.display = "flex";
            document.getElementById("conteudoDeafultModal").style.display = "none";
        } else {
            document.getElementById("msg").textContent = "Email inválido";
        }
    });

    document.getElementById("btnFazLogin").addEventListener("click", function() {
        var emailLogin = document.getElementById("inputEmailLogin").value;
        var senhaLogin = document.getElementById("inputSenhaLogin").value;



        if(validarEmail(emailLogin)) {
            window.location.href = "perfil.html";
        }else{
            alert("Email ou senha incorretos");
        }

        
    })
});
