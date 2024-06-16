document.addEventListener("DOMContentLoaded", () => {
    var avaliacao = document.getElementById('avaliacao');
    var nomeCompleto = document.getElementById('nomeCompleto');

    
    function fetchAvaliacao() {
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
    fetchNomeCompleto();
    
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
    const btnSalvar = document.getElementById('btnSalvar');
    btnSalvar.addEventListener('click', salvarInformacoes);

    const salvarInformacoes = () => {
        const email = document.getElementById('inputEmail').value;
        const username = document.getElementById('inputUsername').value;
        const newPassword = document.getElementById('inputNewPassword').value;
        const confirmPassword = document.getElementById('inputConfirmPassword').value;
        const genero = document.getElementById('selectGenero').value;
        const generoOutro = document.getElementById('inputGeneroOutro').value;

        let valid = true;
        const updateData = {};

        if (email.trim() && !validateEmail(email)) {
            invalidarCampo('inputEmail');
            valid = false;
        } else {
            validarCampo('inputEmail');
            updateData.email = email;
        }

        if (username.trim()) updateData.username = username;

        if ((newPassword.trim() || confirmPassword.trim()) && newPassword !== confirmPassword) {
            invalidarCampo('inputNewPassword');
            invalidarCampo('inputConfirmPassword');
            valid = false;
        } else {
            validarCampo('inputNewPassword');
            validarCampo('inputConfirmPassword');
            updateData.newPassword = newPassword;
        }

        if (genero) {
            if (genero === "Outro" && !generoOutro.trim()) {
                invalidarCampo('inputGeneroOutro');
                valid = false;
            } else {
                validarCampo('selectGenero');
                validarCampo('inputGeneroOutro');
                updateData.genero = genero === "Outro" ? generoOutro : genero;
            }
        }

        if (valid) {
            console.log("Dados atualizados:", updateData);
            alert("Informações salvas com sucesso!");
            closeModal(document.getElementById('modalEditarInfo'));
            enviarDados('/usuario', 'PUT', updateData);
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };

    const invalidarCampo = (id) => {
        document.getElementById(id).classList.add('inputInvalidado');
    };

    const validarCampo = (id) => {
        document.getElementById(id).classList.remove('inputInvalidado');
    };

    // Função para enviar dados para o servidor
    const enviarDados = (url, method, data) => {
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    };

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
