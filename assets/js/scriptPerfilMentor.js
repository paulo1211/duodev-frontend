document.addEventListener("DOMContentLoaded", function() {
    var modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroCompetencias: 'modalCadastroCompetencias',
        btnRankingMentores: 'modalRankingMentores',
        btnEncerrarConta: 'modalEncerrarConta',
        btnSolicitacaoAluno: 'modalSolicitacaoAluno'
    };

    Object.keys(modals).forEach(function(btnId) {
        var btn = document.getElementById(btnId);
        var modal = document.getElementById(modals[btnId]);
        var span = modal.getElementsByClassName("close")[0];

        btn.addEventListener('click', function() {
            modal.style.display = "block";
            if (btnId === 'btnRankingMentores') {
                carregarRanking();
            } else if (btnId === 'btnCadastroCompetencias') {
                carregarCompetencias();
            }
        });

        span.addEventListener('click', function() {
            modal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    });

    // Modal Editar Informações
    var selectGenero = document.getElementById('selectGenero');
    var inputGeneroOutro = document.getElementById('inputGeneroOutro');

    selectGenero.addEventListener('change', function() {
        if (selectGenero.value === 'Outro') {
            inputGeneroOutro.style.display = 'block';
        } else {
            inputGeneroOutro.style.display = 'none';
        }
    });

    var btnSalvar = document.getElementById('btnSalvar');

    btnSalvar.addEventListener('click', function() {
        var email = document.getElementById('inputEmail').value;
        var username = document.getElementById('inputUsername').value;
        var newPassword = document.getElementById('inputNewPassword').value;
        var confirmPassword = document.getElementById('inputConfirmPassword').value;
        var genero = document.getElementById('selectGenero').value;
        var generoOutro = document.getElementById('inputGeneroOutro').value;

        var valid = true;
        var updateData = {};

        if (email.trim() !== "") {
            if (!validateEmail(email)) {
                document.getElementById('inputEmail').classList.add('inputInvalidado');
                valid = false;
            } else {
                document.getElementById('inputEmail').classList.remove('inputInvalidado');
                updateData.email = email;
            }
        }

        if (username.trim() !== "") {
            updateData.username = username;
        }

        if (newPassword.trim() !== "" || confirmPassword.trim() !== "") {
            if (newPassword !== confirmPassword) {
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
            if (genero === "Outro" && generoOutro.trim() === "") {
                document.getElementById('inputGeneroOutro').classList.add('inputInvalidado');
                valid = false;
            } else {
                document.getElementById('selectGenero').classList.remove('inputInvalidado');
                document.getElementById('inputGeneroOutro').classList.remove('inputInvalidado');
                updateData.genero = genero === "Outro" ? generoOutro : genero;
            }
        }

        if (valid) {
            // salvar as informações no servidor
            console.log("Dados atualizados:", updateData);
            alert("Informações salvas com sucesso!");
            document.getElementById('modalEditarInfo').style.display = "none";
            
            // Exemplo de chamada para o endpoint de edição de informações

            fetch('/usuario', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }
    //Fim do modal Editar Informações

    // Modal Selecionar competencias
    var competenciasSelecionadas = new Set();
    var competenciasContainer = document.getElementById('competenciasContainer');
    var btnAdicionarCompetencias = document.getElementById('btnAdicionarCompetencias');

    function carregarCompetencias() {
        competenciasContainer.innerHTML = ''
        var competencias = [
            "Java", "C++", "JavaScript", "Python", "C#"
        ];

        competencias.forEach(function(competencia) {
            var button = document.createElement('button');
            button.className = 'btnComandos';
            button.setAttribute('data-competencia', competencia);
            button.innerText = competencia;

            button.addEventListener('click', function() {
                var competencia = button.getAttribute('data-competencia');
                if (competenciasSelecionadas.has(competencia)) {
                    competenciasSelecionadas.delete(competencia);
                    button.classList.remove('selected');
                } else {
                    competenciasSelecionadas.add(competencia);
                    button.classList.add('selected');
                }
            });

            competenciasContainer.appendChild(button);
        });
    }

    btnAdicionarCompetencias.addEventListener('click', function() {
        if (competenciasSelecionadas.size > 0) {
            alert('Competências selecionadas: ' + Array.from(competenciasSelecionadas).join(', '));
            document.getElementById('modalCadastroCompetencias').style.display = "none";
            
            // Exemplo de chamada para o endpoint de cadastro de competências
            
            fetch('/competencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ competencias: Array.from(competenciasSelecionadas) })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
            
        } else {
            alert("Por favor, selecione pelo menos uma competência.");
        }
    });
    //fim do modal Selecionar Competencias

    // Modal Ranking
    function carregarRanking() {
        var mentores = [
            { nome: "João", pontuacao: 150 },
            { nome: "Maria", pontuacao: 130 },
            { nome: "Carlos", pontuacao: 120 },
            { nome: "Ana", pontuacao: 110 },
            { nome: "Pedro", pontuacao: 100 }
        ];

        var rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
        rankingTable.innerHTML = "";

        mentores.forEach(function(mentor, index) {
            var row = rankingTable.insertRow();
            var cellPosicao = row.insertCell(0);
            var cellNome = row.insertCell(1);
            var cellPontuacao = row.insertCell(2);

            cellPosicao.innerHTML = index + 1;
            cellNome.innerHTML = mentor.nome;
            cellPontuacao.innerHTML = mentor.pontuacao;
        });

        // Exemplo de chamada para o endpoint de ranking de mentores
        
        fetch('/ranking/mentores', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            rankingTable.innerHTML = "";
            data.forEach(function(mentor, index) {
                var row = rankingTable.insertRow();
                var cellPosicao = row.insertCell(0);
                var cellNome = row.insertCell(1);
                var cellPontuacao = row.insertCell(2);

                cellPosicao.innerHTML = index + 1;
                cellNome.innerHTML = mentor.nome;
                cellPontuacao.innerHTML = mentor.pontuacao;
            });
        })
        .catch(error => console.error('Error:', error));
        
    }
    // Fim do Modal Ranking

    Object.keys(modals).forEach(function(btnId) {
        var btn = document.getElementById(btnId);
        var modal = document.getElementById(modals[btnId]);
        var span = modal.getElementsByClassName("close")[0];

        if (btn) {
            btn.addEventListener('click', function() {
                modal.style.display = "block";
                if (btnId === 'btnRankingMentores') {
                    carregarRanking();
                } else if (btnId === 'btnCadastroCompetencias') {
                    carregarCompetencias();
                }
            });

            span.addEventListener('click', function() {
                modal.style.display = "none";
            });

            window.addEventListener('click', function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            });
        }
    });

    var btnAceitar = document.querySelector('.btnSolicitacao.aceitar');
    var btnRecusar = document.querySelector('.btnSolicitacao.recusar');

    btnAceitar.addEventListener('click', function() {
        alert('Solicitação aceita.');
        document.getElementById('modalSolicitacaoAluno').style.display = "none";
        
        // Exemplo de chamada para o endpoint de solicitação de aluno (aceitar)
        
        fetch('/sessao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ acao: 'aceitar' })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
        
    });

    btnRecusar.addEventListener('click', function() {
        alert('Solicitação recusada.');
        document.getElementById('modalSolicitacaoAluno').style.display = "none";
        
        // Exemplo de chamada para o endpoint de solicitação de aluno (recusar)
        
        fetch('/api/solicitacaoAluno', { // Não sei qual é a chave deste endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ acao: 'recusar' })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
        
    });
});
