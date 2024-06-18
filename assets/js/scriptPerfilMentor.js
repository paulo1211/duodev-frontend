document.addEventListener("DOMContentLoaded", () => {
    var avaliacao = document.getElementById('avaliacao');
    var nomeCompleto = document.getElementById('nomeCompleto');
    
    const modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroCompetencias: 'modalCadastroCompetencias',
        btnEncerrarConta: 'modalEncerrarConta',
        btnSolicitacaoAluno: 'modalSolicitacaoAluno'
    };

    Object.keys(modals).forEach(btnId => {
        const btn = document.getElementById(btnId);
        const modal = document.getElementById(modals[btnId]);
        if (btn && modal) {
            const span = modal.getElementsByClassName("close")[0];

            btn.addEventListener('click', () => openModal(btnId, modal));
            if (span) span.addEventListener('click', () => closeModal(modal));
            window.addEventListener('click', (event) => {
                if (event.target === modal) closeModal(modal);
            });
        }
    });

    const openModal = (btnId, modal) => {
        modal.style.display = "block";
        switch (btnId) {
            case 'btnCadastroCompetencias':
                carregarCompetencias();
                break;
            case 'btnSolicitacaoAluno':
                carregarSolicitacoes();
                break;
            case 'btnEditarInfo':
                carregaUsuario();
                break;
        }
    };

    const closeModal = (modal) => {
        modal.style.display = "none";
    };

    // Modal Editar Informações
    var btnSalvar = document.getElementById('btnSalvar');

    function carregaUsuario(){
        const usuarioJSON = sessionStorage.getItem('usuario');
        if (usuarioJSON) {
            const usuario = JSON.parse(usuarioJSON);
            document.getElementById('inputEmail').value = usuario.email || '';
            document.getElementById('inputUsername').value = usuario.nome || '';
            document.getElementById('inputNewPassword').value = usuario.senha || '';
            document.getElementById('selectGenero').value = usuario.sexo || '';
            document.getElementById('inputDataNascimento').value = usuario.dataNascimento || '';
            document.getElementById("inputCPF").value = usuario.cpf || '';
        } else {
            alert("Usuário não logado");
        }
    }

    
    btnSalvar.addEventListener('click', function() {
        var email = document.getElementById('inputEmail').value;
        var username = document.getElementById('inputUsername').value;
        var newPassword = document.getElementById('inputNewPassword').value;
        var confirmPassword = document.getElementById('inputConfirmPassword').value;
        var genero = document.getElementById('selectGenero').value;
        var dataNascimento = document.getElementById('inputDataNascimento').value;
        var cpf = document.getElementById("inputCPF").value.replace(/\D/g, '');

        var valid = true;
        var queryParams = [];

        // Verificar se pelo menos um campo foi alterado
        var campoAlterado = false;

        if (email.trim() === "") {
            document.getElementById('inputEmail').classList.add('inputInvalidado');
            valid = false;
        } else if (!validarEmail(email)) {
            document.getElementById('inputEmail').classList.add('inputInvalidado');
            valid = false;
        } else {
            document.getElementById('inputEmail').classList.remove('inputInvalidado');
            queryParams.push(`email=${encodeURIComponent(email)}`);
            campoAlterado = true;
        }

        if (username.trim() === "") {
            document.getElementById('inputUsername').classList.add('inputInvalidado');
            valid = false;
        } else {
            document.getElementById('inputUsername').classList.remove('inputInvalidado');
            queryParams.push(`nome=${encodeURIComponent(username)}`);
            campoAlterado = true;
        }

        if (newPassword.trim() === "" || confirmPassword.trim() === "") {
            document.getElementById('inputNewPassword').classList.add('inputInvalidado');
            document.getElementById('inputConfirmPassword').classList.add('inputInvalidado');
            valid = false;
        } else if (newPassword.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            valid = false;
        } else if (newPassword !== confirmPassword) {
            document.getElementById('inputNewPassword').classList.add('inputInvalidado');
            document.getElementById('inputConfirmPassword').classList.add('inputInvalidado');
            valid = false;
        } else {
            document.getElementById('inputNewPassword').classList.remove('inputInvalidado');
            document.getElementById('inputConfirmPassword').classList.remove('inputInvalidado');
            queryParams.push(`senha=${encodeURIComponent(newPassword)}`);
            campoAlterado = true;
        }

        if (genero === "") {
            document.getElementById('selectGenero').classList.add('inputInvalidado');
            valid = false;
        } else {
            document.getElementById('selectGenero').classList.remove('inputInvalidado');
            queryParams.push(`sexo=${encodeURIComponent(genero)}`);
            campoAlterado = true;
        }

        if (dataNascimento.trim() === "") {
            document.getElementById('inputDataNascimento').classList.add('inputInvalidado');
            valid = false;
        } else {
            document.getElementById('inputDataNascimento').classList.remove('inputInvalidado');
            queryParams.push(`dataNascimento=${encodeURIComponent(dataNascimento)}`);
            campoAlterado = true;
        }

        if (cpf.trim() === "") {
            document.getElementById('inputCPF').classList.add('inputInvalidado');
            valid = false;
        } else if (!validarCPF(cpf)) {
            document.getElementById('inputCPF').classList.add('inputInvalidado');
            alert("CPF inválido.");
            valid = false;
        } else {
            document.getElementById('inputCPF').classList.remove('inputInvalidado');
            queryParams.push(`cpf=${encodeURIComponent(cpf)}`);
            campoAlterado = true;
        }

        if (!valid) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        if (!campoAlterado) {
            alert("Por favor, altere pelo menos uma informação.");
            return;
        }

        if (valid) {
            var id
            const usuarioJSON = sessionStorage.getItem('usuario');
            if (usuarioJSON) {
                const usuario = JSON.parse(usuarioJSON);
                id = usuario.id;
            }else{
                id = "";
            }

            var queryString = queryParams.join('&');
            var url = `/usuario/${id}?${queryString}`;

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Dados atualizados:", data);
                alert("Informações salvas com sucesso!");
                document.getElementById('modalEditarInfo').style.display = "none";
            })
            .catch(error => {
                console.error('Erro ao salvar informações:', error);
            });
        }
    });
    

    const validarEmail = (email) => {
        const re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        return resto === 10 || resto === 11 ? 0 : resto === parseInt(cpf.substring(10, 11));
    }

    document.getElementById('inputCPF').addEventListener('input', function(e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.slice(0, 11);
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = cpf;
    });
});
