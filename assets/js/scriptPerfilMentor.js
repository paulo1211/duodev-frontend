document.addEventListener("DOMContentLoaded", () => {
    var avaliacao = document.getElementById('avaliacao');
    var nomeCompleto = document.getElementById('nomeCompleto');

    
    /*function fetchAvaliacao() {
        fetch('/api/avaliacao')
            .then(response => response.json())
            .then(data => {
                avaliacao.textContent = data.avaliacao;
                console.log('Avaliação:', data.avaliacao);
            })
            .catch(error => console.error('Erro ao buscar avaliação:', error));
    }

    function fetchNomeCompleto() {
        fetch('/api/nomeCompleto')
            .then(response => response.json())
            .then(data => {
                nomeCompleto.textContent = data.nomeCompleto;
                console.log('Nome Completo:', data.nomeCompleto);
            })
            .catch(error => console.error('Erro ao buscar nome completo:', error));
    }

    
    fetchAvaliacao();
    fetchNomeCompleto();*/
    
    const modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroCompetencias: 'modalCadastroCompetencias',
        btnRankingMentores: 'modalRankingMentores',
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
            case 'btnRankingMentores':
                carregarRanking();
                break;
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
        var updateData = {};

        // Verificar se pelo menos um campo foi alterado
        var campoAlterado = false;

        if (email.trim() !== "") {
            campoAlterado = true;
            if (!validarEmail(email)) {
                document.getElementById('inputEmail').classList.add('inputInvalidado');
                valid = false;
            } else {
                document.getElementById('inputEmail').classList.remove('inputInvalidado');
                updateData.email = email;
            }
        }

        if (username.trim() !== "") {
            campoAlterado = true;
            updateData.username = username;
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
                updateData.newPassword = newPassword;
            }
        }

        if (genero !== "") {
            campoAlterado = true;
            document.getElementById('selectGenero').classList.remove('inputInvalidado');
            updateData.genero = genero;
        }

        if (dataNascimento.trim() !== "") {
            campoAlterado = true;
            document.getElementById('inputDataNascimento').classList.remove('inputInvalidado');
            updateData.dataNascimento = dataNascimento;
        }

        if (cpf.trim() !== "") {
            campoAlterado = true;
            if (!validarCPF(cpf)) {
                document.getElementById('inputCpf').classList.add('inputInvalidado');
                alert("CPF inválido.");
                valid = false;
            } else {
                document.getElementById('inputCpf').classList.remove('inputInvalidado');
                updateData.cpf = cpf;
            }
        }

        if (!campoAlterado) {
            alert("Por favor, altere pelo menos uma informação.");
            return;
        }

        if (valid) {
            fetch('/api/updateUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
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
    const btnAdicionarCompetencias = document.getElementById('btnAdicionarCompetencias');
    btnAdicionarCompetencias.addEventListener('click', adicionarCompetencias);

    const adicionarCompetencias = () => {
        const selectCompetencias = document.getElementById('selectCompetencias').value;

        if (selectCompetencias) {
            console.log("Competência selecionada:", selectCompetencias);
            alert("Competência salva com sucesso!");
            closeModal(document.getElementById('modalCadastroCompetencias'));
            enviarDados('/competencia', 'POST', { competencia: selectCompetencias });
        } else {
            alert("Por favor, selecione uma competência.");
        }
    };

    // Função para carregar Competências (placeholder)
    const carregarCompetencias = () => {
        // Adicione funcionalidades adicionais se necessário
    };

    // Modal Ranking
    const carregarRanking = () => {
        const mentores = [
            { nome: "João", pontuacao: 150 },
            { nome: "Maria", pontuacao: 130 },
            { nome: "Carlos", pontuacao: 120 },
            { nome: "Ana", pontuacao: 110 },
            { nome: "Pedro", pontuacao: 100 }
        ];

        const rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
        rankingTable.innerHTML = "";

        mentores.forEach((mentor, index) => {
            const row = rankingTable.insertRow();
            row.insertCell(0).innerHTML = index + 1;
            row.insertCell(1).innerHTML = mentor.nome;
            row.insertCell(2).innerHTML = mentor.pontuacao;
        });

        fetch('/ranking/mentores', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                rankingTable.innerHTML = "";
                data.forEach((mentor, index) => {
                    const row = rankingTable.insertRow();
                    row.insertCell(0).innerHTML = index + 1;
                    row.insertCell(1).innerHTML = mentor.nome;
                    row.insertCell(2).innerHTML = mentor.pontuacao;
                });
            })
            .catch(error => console.error('Error:', error));
    };

    // Modal Solicitações de Alunos
    const carregarSolicitacoes = () => {
        fetch('/api/carregarSolicitacoes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(solicitacoes => {
            var listaCards = document.querySelector('.listaCards');
            listaCards.innerHTML = '';
            solicitacoes.forEach(function(solicitacao) {
                var card = document.createElement('div');
                card.className = 'solicitacao-card card';
                card.innerHTML = `
                    <h3>Solicitação ${solicitacao.id}</h3>
                    <p>ID: ${solicitacao.id}</p>
                    <p>Email do Aluno: ${solicitacao.email}</p>
                    <p>Data de Início: ${solicitacao.dataInicio}</p>
                    <p>Data do Fim: ${solicitacao.dataFim}</p>
                `;
                listaCards.appendChild(card);
            });
            if (solicitacoes.length === 0) {
                var mensagem = document.createElement('p');
                mensagem.textContent = 'Nenhuma solicitação encontrada.';
                listaCards.appendChild(mensagem);
            }
        })
        .catch(error => console.error('Erro ao carregar solicitações:', error));
    };
});
