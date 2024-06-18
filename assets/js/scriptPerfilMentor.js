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
        const span = modal.getElementsByClassName("close")[0];

        btn.addEventListener('click', () => openModal(btnId, modal));
        span.addEventListener('click', () => closeModal(modal));
        window.addEventListener('click', (event) => {
            if (event.target === modal) closeModal(modal);
        });
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
        }
    };

    const closeModal = (modal) => {
        modal.style.display = "none";
    };

    // Modal Editar Informações
    var btnSalvar = document.getElementById('btnSalvar');

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

        if (email.trim() !== "") {
            campoAlterado = true;
            if (!validarEmail(email)) {
                document.getElementById('inputEmail').classList.add('inputInvalidado');
                valid = false;
            } else {
                document.getElementById('inputEmail').classList.remove('inputInvalidado');
                queryParams.push(`email=${encodeURIComponent(email)}`);
            }
        }

        if (username.trim() !== "") {
            campoAlterado = true;
            queryParams.push(`nome=${encodeURIComponent(username)}`);
        }

        if (newPassword.trim() !== "" || confirmPassword.trim() !== "") {
            campoAlterado = true;
            if (newPassword.length < 6) {
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
            }
        }

        if (genero !== "") {
            campoAlterado = true;
            document.getElementById('selectGenero').classList.remove('inputInvalidado');
            queryParams.push(`sexo=${encodeURIComponent(genero)}`);
        }

        if (dataNascimento.trim() !== "") {
            campoAlterado = true;
            document.getElementById('inputDataNascimento').classList.remove('inputInvalidado');
            queryParams.push(`dataNascimento=${encodeURIComponent(dataNascimento)}`);
        }

        if (cpf.trim() !== "") {
            campoAlterado = true;
            if (!validarCPF(cpf)) {
                document.getElementById('inputCpf').classList.add('inputInvalidado');
                alert("CPF inválido.");
                valid = false;
            } else {
                document.getElementById('inputCpf').classList.remove('inputInvalidado');
                queryParams.push(`cpf=${encodeURIComponent(cpf)}`);
            }
        }

        if (!campoAlterado) {
            alert("Por favor, altere pelo menos uma informação.");
            return;
        }

        if (valid) {
            // Supondo que você tenha o ID do usuário armazenado em uma variável userId
            var userId = 123; // Substitua com a lógica para obter o ID do usuário

            var queryString = queryParams.join('&');
            var url = `/usuario/${userId}?${queryString}`;

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
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
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

    // Modal Selecionar Competências
    const carregarCompetencias = () => {
        fetch('/competencias', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(competencias => {
            const selectCompetencias = document.getElementById('selectCompetencias');
            selectCompetencias.innerHTML = '<option value="">Selecione uma competência</option>'; // Limpar o select e adicionar a opção padrão

            competencias.forEach(competencia => {
                const option = document.createElement('option');
                option.value = competencia.id; // Assumindo que a competência possui um ID
                option.textContent = competencia.nome; // Assumindo que a competência possui um nome
                selectCompetencias.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar competências:', error));
    };

    // Função para adicionar competência selecionada
    const adicionarCompetenciasMentor = () => {
        const selectCompetencias = document.getElementById('selectCompetencias').value;

        if (selectCompetencias) {
            fetch('/api/adicionarCompetencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ competenciaId: selectCompetencias })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Competência selecionada:", data);
                alert("Competência salva com sucesso!");
                document.getElementById('modalCadastroCompetencias').style.display = "none";
            })
            .catch(error => {
                console.error('Erro ao salvar competência:', error);
            });
        } else {
            alert("Por favor, selecione uma competência.");
        }
    };

    // Adicionar evento para salvar competência
    const btnSalvarCompetencia = document.getElementById('btnAdicionarCompetencias');
    if (btnSalvarCompetencia) {
        btnSalvarCompetencia.addEventListener('click', adicionarCompetenciasMentor);
    } else {
        console.error('Botão "Adicionar Competências" não encontrado.');
    }

    document.addEventListener("DOMContentLoaded", function() {
        const userEmail = sessionStorage.getItem('userEmail');
        if (userEmail) {
            console.log('User email:', userEmail);
            // fetch(`/api/userData?email=${userEmail}`).then(...);
        }
    });

    // Modal Encerrar Conta
    var btnEncerrar = document.getElementById('btnEncerrar');

    btnEncerrar.addEventListener('click', function() {
        var confirmacao = confirm("Tem certeza de que deseja encerrar sua conta?");
        if (confirmacao) {
            fetch('/api/encerrarConta', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: 'userId' })
            })
            .then(response => response.json())
            .then(data => {
                alert('Conta encerrada com sucesso!');
                sessionStorage.clear();  // Limpar o SessionStorage
                document.getElementById('modalEncerrarConta').style.display = "none";
            })
            .catch(error => console.error('Erro ao encerrar conta:', error));
        }
    });

    //Fim do Modal Encerrar Conta
});
