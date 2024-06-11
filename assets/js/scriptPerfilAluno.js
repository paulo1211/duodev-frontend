document.addEventListener("DOMContentLoaded", function() {
    var modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroInteresses: 'modalCadastroInteresses',
        btnRankingAlunos: 'modalRankingAlunos',
        btnMarcarHorarioMentor: 'modalMarcarHorarioMentor',
        btnEncerrarConta: 'modalEncerrarConta',
        btnProcurarMentor: 'modalProcuraMentor'
    };

    Object.keys(modals).forEach(function(btnId) {
        var btn = document.getElementById(btnId);
        var modal = document.getElementById(modals[btnId]);
        var span = modal.getElementsByClassName("close")[0];

        btn.addEventListener('click', function() {
            modal.style.display = "block";
            if (btnId === 'btnRankingAlunos') {
                carregarRanking();
            }else if(btnId === 'btnCadastroInteresses'){
                carregarInteresses();
            }else if(btnId === 'btnProcurarMentor'){
                resetarModalProcuraMentor();
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
            // Salvar as informações no servidor
            /*
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
            */
            console.log("Dados atualizados:", updateData);
            alert("Informações salvas com sucesso!");
            document.getElementById('modalEditarInfo').style.display = "none";
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }
    //Fim do modal Editar Informações

    // Modal Selecionar Interesses
    var interessesSelecionados = new Set();
    var interesseContainer = document.getElementById('interesseContainer');
    var btnAdicionarInteresse = document.getElementById('btnAdicionarInteresse');

    function carregarInteresses() {
        interesseContainer.innerHTML = ''
        var interesses = [
            "Java", "C++", "JavaScript", "Python", "C#"
        ];

        interesses.forEach(function(interesse) {
            var button = document.createElement('button');
            button.className = 'btnInteresses';
            button.setAttribute('data-interesse', interesse);
            button.innerText = interesse;

            button.addEventListener('click', function() {
                var interesse = button.getAttribute('data-interesse');
                if (interessesSelecionados.has(interesse)) {
                    interessesSelecionados.delete(interesse);
                    button.classList.remove('selected');
                } else {
                    interessesSelecionados.add(interesse);
                    button.classList.add('selected');
                }
            });
            
            interesseContainer.appendChild(button);
        });
    }

    btnAdicionarInteresse.addEventListener('click', function() {
        if (interessesSelecionados.size > 0) {
            // Enviar lista ao servidor
            /*
            fetch('/api/cadastrarInteresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interesses: Array.from(interessesSelecionados) })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Interesses selecionados:", data);
                alert("Interesses salvos com sucesso!");
                document.getElementById('modalCadastroInteresses').style.display = "none";
            })
            .catch(error => {
                console.error('Erro ao salvar interesses:', error);
            });
            */
            console.log("Interesses selecionados:", Array.from(interessesSelecionados));
            alert("Interesses salvos com sucesso!");
            document.getElementById('modalCadastroInteresses').style.display = "none";
        } else {
            alert("Por favor, selecione pelo menos um interesse.");
        }
    });
    //Fim do modal Selecionar Interesses

    // Modal Marcar Horário com Mentor
    var btnSolicitar = document.getElementById('btnSolicitar');
    btnSolicitar.addEventListener('click', function() {
        var inputDataMentor = document.getElementById('inputDataMentor').value;
        var inputHoraMentor = document.getElementById('inputHoraMentor').value;

        if (inputDataMentor && inputHoraMentor) {
            // Enviar solicitação ao servidor
            /*
            fetch('/api/marcarHorario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: inputDataMentor, hora: inputHoraMentor, mentorId: 'mentorId' })
            })
            .then(response => response.json())
            .then(data => {
                alert('Horário solicitado para: ' + inputDataMentor + ' às ' + inputHoraMentor);
                document.getElementById('modalMarcarHorarioMentor').style.display = "none";
            })
            .catch(error => console.error('Erro ao marcar horário:', error));
            */
            alert('Horário solicitado para: ' + inputDataMentor + ' às ' + inputHoraMentor);
            document.getElementById('modalMarcarHorarioMentor').style.display = "none";
        } else {
            alert('Por favor, selecione uma data e hora.');
        }
    });
    // Fim do Modal Marcar Horário com Mentor

    //Modal Ranking de Alunos
    function carregarRanking() {
        /*
        fetch('/api/getRanking')
        .then(response => response.json())
        .then(data => {
            var rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
            rankingTable.innerHTML = "";

            data.forEach(function(aluno, index) {
                var row = rankingTable.insertRow();
                var cellPosicao = row.insertCell(0);
                var cellNome = row.insertCell(1);
                var cellPontuacao = row.insertCell(2);

                cellPosicao.innerHTML = index + 1;
                cellNome.innerHTML = aluno.nome;
                cellPontuacao.innerHTML = aluno.pontuacao;
            });
        })
        .catch(error => console.error('Erro ao carregar ranking:', error));
        */
        var rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
        rankingTable.innerHTML = "";

        var alunos = [
            { nome: "João", pontuacao: 150 },
            { nome: "Maria", pontuacao: 130 },
            { nome: "Carlos", pontuacao: 120 },
            { nome: "Ana", pontuacao: 110 },
            { nome: "Pedro", pontuacao: 100 }
        ];

        alunos.forEach(function(aluno, index) {
            var row = rankingTable.insertRow();
            var cellPosicao = row.insertCell(0);
            var cellNome = row.insertCell(1);
            var cellPontuacao = row.insertCell(2);

            cellPosicao.innerHTML = index + 1;
            cellNome.innerHTML = aluno.nome;
            cellPontuacao.innerHTML = aluno.pontuacao;
        });
    }
    //Fim do modal Ranking de Alunos

    // Modal Encerrar Conta
    var btnEncerrar = document.getElementById('btnEncerrar');

    btnEncerrar.addEventListener('click', function() {
        var confirmacao = confirm("Tem certeza de que deseja encerrar sua conta?");
        if (confirmacao) {
            /*
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
                document.getElementById('modalEncerrarConta').style.display = "none";
            })
            .catch(error => console.error('Erro ao encerrar conta:', error));
            */
            alert('Conta encerrada com sucesso!');
            document.getElementById('modalEncerrarConta').style.display = "none";
        }
    });
    //Fim do Modal Encerrar Conta

    //Modal Procurar Mentor
    var btnProcurar = document.getElementById('btnProcurar');

    btnProcurar.addEventListener('click', function() {
        var competencia = document.getElementById('competencia').value;
        var anosExperiencia = document.getElementById('anosExperiencia').value;
        
        if (competencia && anosExperiencia) {
            /*
            fetch('/api/procurarMentor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ competencia, anosExperiencia })
            })
            .then(response => response.json())
            .then(mentores => {
                document.getElementById('filtrosBuscaMentor').style.display = 'none';
                document.getElementById('resultadosBusca').style.display = 'block';
                
                var listaCards = document.querySelector('.listaCards');
                listaCards.innerHTML = '';
                mentores.forEach(function(mentor) {
                    var card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <h3>${mentor.nome}</h3>
                        <a>Idade: ${mentor.idade}</a>
                        <a>Gênero: ${mentor.genero}</a>
                        <a>Competência: ${mentor.competencia}</a>
                        <a>Anos de Experiência: ${mentor.experiencia}</a>
                        <button class="btnGeral" id="marcaHorario">Marcar horário</button>
                    `;
                    listaCards.appendChild(card);
                });
                if (mentores.length === 0) {
                    var mensagem = document.createElement('p');
                    mensagem.textContent = 'Nenhum mentor encontrado com os filtros selecionados.';
                    listaCards.appendChild(mensagem);
                }
            })
            .catch(error => console.error('Erro ao procurar mentor:', error));
            */
            document.getElementById('filtrosBuscaMentor').style.display = 'none';
            document.getElementById('resultadosBusca').style.display = 'block';

            var listaCards = document.querySelector('.listaCards');
            listaCards.innerHTML = '';

            var mentores = [
                { nome: 'João Silva', idade: 35, genero: 'Masculino', competencia: 'Java', experiencia: '5-10' },
                { nome: 'Maria Oliveira', idade: 30, genero: 'Feminino', competencia: 'Python', experiencia: '2-4' },
                { nome: 'Carlos Pereira', idade: 28, genero: 'Masculino', competencia: 'C++', experiencia: '1-2' },
                { nome: 'João Silva', idade: 35, genero: 'Masculino', competencia: 'Java', experiencia: '5-10' }
            ];

            var resultadosFiltrados = mentores.filter(function(mentor) {
                return mentor.competencia === competencia && mentor.experiencia === anosExperiencia;
            });

            resultadosFiltrados.forEach(function(mentor) {
                var card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${mentor.nome}</h3>
                    <a>Idade: ${mentor.idade}</a>
                    <a>Gênero: ${mentor.genero}</a>
                    <a>Competência: ${mentor.competencia}</a>
                    <a>Anos de Experiência: ${mentor.experiencia}</a>
                    <button class="btnGeral" id="marcaHorario">Marcar horário</button>
                `;
                listaCards.appendChild(card);
            });

            if (resultadosFiltrados.length === 0) {
                var mensagem = document.createElement('p');
                mensagem.textContent = 'Nenhum mentor encontrado com os filtros selecionados.';
                listaCards.appendChild(mensagem);
            }
        } else {
            alert('Por favor, selecione uma competência e um período de experiência.');
        }
    });

    function resetarModalProcuraMentor() {
        document.getElementById('filtrosBuscaMentor').style.display = 'flex';
        document.getElementById('resultadosBusca').style.display = 'none';
    }
    //Fim do modal Procurar Mentor
});
