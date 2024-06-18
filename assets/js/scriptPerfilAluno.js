var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

function carregaUsuarioNovamente(){
    fetch(`http://localhost:8080/usuario/${usuarioLogado.id}`)
    .then(response => response.json())
    .then(data => {
        usuarioLogado = data;
        console.log("Usuario carregado:", usuarioLogado);
    })
    .catch(error => {
        console.error('Erro ao carregar usuário:', error);
    });
}

carregaUsuarioNovamente();


document.addEventListener("DOMContentLoaded", function() {
    
    var avaliacao = document.getElementById('avaliacao');
    var nomeCompleto = document.getElementById('nomeCompleto');

    nomeCompleto.innerHTML = usuarioLogado.nome;

    var modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroInteresses: 'modalCadastroInteresses',
        btnEncerrarConta: 'modalEncerrarConta',
        btnProcurarMentor: 'modalProcuraMentor'
    };

    Object.keys(modals).forEach(function(btnId) {
        var btn = document.getElementById(btnId);
        var modal = document.getElementById(modals[btnId]);
        var span = modal.getElementsByClassName("close")[0];

        btn.addEventListener('click', function() {
            modal.style.display = "block";
            if (btnId === 'btnCadastroInteresses') {
                carregarInteresses();
            } else if (btnId === 'btnProcurarMentor') {
                resetarModalProcuraMentor();
            }else if (btnId === 'btnEditarInfo'){
                carregaUsuario();
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

    function carregarInteresses() {
        fetch('http://localhost:8080/competencia')
        .then(response => response.json())
        .then(data => {
            var selectInteresses = document.getElementById('selectInteresses');
            selectInteresses.innerHTML = '';
            data.forEach(function(item) {
                var option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nome;
                selectInteresses.appendChild(option);
            }
            );

        })
        .catch(error => console.error('Erro ao carregar interesses:', error));
    }

    // Modal Editar Informações

    function carregaUsuario(){
        if (usuarioLogado) {
            document.getElementById('inputEmail').value = usuarioLogado.email || '';
            document.getElementById('inputUsername').value = usuarioLogado.nome || '';
            document.getElementById('inputNewPassword').value = usuarioLogado.senha || '';
            document.getElementById('selectGenero').value = usuarioLogado.sexo || '';
            document.getElementById('inputDataNascimento').value = usuarioLogado.dataNascimento || '';
            document.getElementById("inputCPF").value = usuarioLogado.cpf || '';
        }else{
            alert("Usuario não logado");
        }
    }

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
            if (usuarioLogado) {
                const usuario = usuarioLogado;
                id = usuario.id;
            }else{
                id = "";
            }

            // var queryString = queryParams.join('&');
            // console.log("Query string:", queryString);

            usuario = {
                email: email,
                nome: username,
                senha: newPassword,
                sexo: genero,
                dataNascimento: dataNascimento,
                cpf: cpf
            };

            console.log("Usuario enviado:", usuario);

            var url = `http://localhost:8080/usuario/${id}`;

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)

            })
            .then(response => response.json())
            .then(data => {
               // const parsedData = JSON.parse(data)
                console.log("Dados atualizados:", data);
                alert("Informações salvas com sucesso!");
                document.getElementById('modalEditarInfo').style.display = "none";
            
    
            })
            .catch(error => {
                console.error('Erro ao salvar informações:', error);
            });
        }
    });

 
    function carregarCompetencias(){
        fetch('http://localhost:8080/competencia')
        .then(response => response.json())
        .then(data => {
            var selectCompetencias = document.getElementById('competencia');
            selectCompetencias.innerHTML = '';
            data.forEach(function(item) {
                var option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nome;
                selectCompetencias.appendChild(option);
            }
            );
        })
        .catch(error => console.error('Erro ao carregar competências:', error));
    }
    carregarCompetencias();

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

    // Modal Selecionar Interesses
    var btnSalvarInteresse = document.getElementById('btnSalvarInteresse');

    btnSalvarInteresse.addEventListener('click', function() {
        var selectInteresses = document.getElementById('selectInteresses').value;

        if (selectInteresses) {
            
            fetch('http://localhost:8080/competencia', {
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

        
    var btnSolicitar = document.getElementById('btnSolicitar');
    
    btnSolicitar.addEventListener('click', function() {
        var emailMentor = 'blabla@gmail.com';
        var emailMentorado = 'blabla@yahoo.com.br';

        if (emailMentor && emailMentorado) {
            var path = `/sessao?emailMentor=${emailMentor}&emailMentorado=${emailMentorado}`;
            console.log('Sessão criada com URL:', path);
            alert(`Sessão criada com URL: ${path}`);
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    document.addEventListener("DOMContentLoaded", function() {
        const userEmail = sessionStorage.getItem('userEmail');
        if (userEmail) {
            console.log('User email:', userEmail);
            // Você pode usar o email recuperado para buscar mais informações do usuário, por exemplo:
            // fetch(`/api/userData?email=${userEmail}`).then(...);
        }
    });
    var btnSair = document.getElementById('btnLogOut');

    btnSair.addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = "/index.html";
    });

    var btnTrocaPerfil = document.getElementById("btnTrocaPerfil");

    btnTrocaPerfil.addEventListener("click", function(){
        
        var usuarioLogado2 = {
            id: usuarioLogado.id,
            email: usuarioLogado.email,
            senha: usuarioLogado.senha,
            nome: usuarioLogado.nome, 
            sexo: usuarioLogado.sexo, 
            dataNascimento: usuarioLogado.dataNascimento, 
            cpf: usuarioLogado.cpf 
        };

        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado2));

        window.location.href = 'perfilAluno.html';
    })
    
});
