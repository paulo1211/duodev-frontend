document.addEventListener("DOMContentLoaded", function() {
    
    var avaliacao = document.getElementById('avaliacao');
    var nomeCompleto = document.getElementById('nomeCompleto');

    /*
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
    fetchNomeCompleto();*/
    
    
    var modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroInteresses: 'modalCadastroInteresses',
        btnRankingAlunos: 'modalRankingAlunos',
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

    function validarEmail(email) {
        var re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

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
    //Fim do modal Editar Informações

    Object.keys(modals).forEach(function(btnId) {
        var btn = document.getElementById(btnId);
        var modal = document.getElementById(modals[btnId]);
        var span = modal.getElementsByClassName("close")[0];

        btn.addEventListener('click', function() {
            modal.style.display = "block";
            if (btnId === 'btnRankingAlunos') {
                carregarRanking();
            } else if (btnId === 'btnCadastroInteresses') {
                carregarInteresses();
            } else if (btnId === 'btnProcurarMentor') {
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

    // Modal Selecionar Interesses
    var btnSalvarInteresse = document.getElementById('btnSalvarInteresse');

    btnSalvarInteresse.addEventListener('click', function() {
        var selectInteresses = document.getElementById('selectInteresses').value;

        if (selectInteresses) {
            
            fetch('/api/cadastrarInteresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interesse: selectInteresses })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Interesse selecionado:", data);
                alert("Interesse salvo com sucesso!");
                document.getElementById('modalCadastroInteresses').style.display = "none";
            })
            .catch(error => {
                console.error('Erro ao salvar interesse:', error);
            });
            
            console.log("Interesse selecionado:", selectInteresses);
            alert("Interesse salvo com sucesso!");
            document.getElementById('modalCadastroInteresses').style.display = "none";
        } else {
            alert("Por favor, selecione um interesse.");
        }
    });
    //Fim do modal Selecionar Interesses


    //Modal Ranking de Alunos
    function carregarRanking() {
        fetch('/ranking/mentorados').then(response => response.json())
        .then((mentoradosData) => {
            var rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
            rankingTable.innerHTML = "";
    
            function addRows(data) {
                data.forEach(function(entry, index) {
                    var row = rankingTable.insertRow();
                    var cellPosicao = row.insertCell(0);
                    var cellNome = row.insertCell(1);
                    var cellPontuacao = row.insertCell(2);
    
                    cellPosicao.innerHTML = index + 1;
                    cellNome.innerHTML = entry.key.nome;
                    cellPontuacao.innerHTML = entry.value;
                });
            }
            addRows(mentoradosData, 'Mentorado');
        })
        .catch(error => console.error('Erro ao carregar ranking:', error));
    }
    //Fim do modal Ranking de Alunos

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
                document.getElementById('modalEncerrarConta').style.display = "none";
            })
            .catch(error => console.error('Erro ao encerrar conta:', error));
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
            console.log(`Procurando mentores para competência: ${competencia}, anos de experiência: ${anosExperiencia}`);
            
            fetch('/api/procurarMentor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ competencia, anosExperiencia })
            })
            .then(response => response.json())
            .then(mentores => {
                console.log('Mentores encontrados:', mentores);
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
                        <button class="btnGeral marcaHorario" data-mentor-nome="${mentor.nome}">Marcar horário</button>
                    `;
                    listaCards.appendChild(card);
                });
                if (mentores.length === 0) {
                    var mensagem = document.createElement('p');
                    mensagem.textContent = 'Nenhum mentor encontrado com os filtros selecionados.';
                    listaCards.appendChild(mensagem);
                }

                // Adicionar evento de clique aos botões de marcar horário
                document.querySelectorAll('.marcaHorario').forEach(function(button) {
                    button.addEventListener('click', function() {
                        var mentorNome = this.getAttribute('data-mentor-nome');
                        console.log('Botão "Marcar horário" clicado para:', mentorNome);

                        // Atualizar o título com o nome do mentor selecionado
                        var titulo = document.querySelector('#divSelecionarHorarioMentor .tituloModal');
                        titulo.textContent = `Marcar horário com mentor: ${mentorNome}`;

                        // Esconder a lista de cards e mostrar a div de selecionar horário
                        document.getElementById('resultadosBusca').style.display = 'none';
                        document.getElementById('divSelecionarHorarioMentor').style.display = 'block';
                    });
                });
            })
            .catch(error => console.error('Erro ao procurar mentor:', error));
            
        } else {
            alert('Por favor, selecione uma competência e um período de experiência.');
        }
    });

    function resetarModalProcuraMentor() {
        document.getElementById('filtrosBuscaMentor').style.display = 'flex';
        document.getElementById('resultadosBusca').style.display = 'none';
        document.getElementById('divSelecionarHorarioMentor').style.display = 'none';
    }
        
    
    //Fim do modal Procurar Mentor
});
