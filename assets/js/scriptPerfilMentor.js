document.addEventListener("DOMContentLoaded", function() {
    var modals = {
        btnEditarInfo: 'modalEditarInfo',
        btnCadastroCompetencias: 'modalCadastroCompetencias',
        btnRankingMentores: 'modalRankingMentores',
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
        } else {
            alert("Por favor, selecione pelo menos uma competência.");
        }
    });
    //fim do modal Selecionar Competencias

    //Modal Marcar Horario com Mentor
    var tabButtons = document.querySelectorAll('.tab-btn');
    var months = document.querySelectorAll('.month');
    var selectedDay = null;

    tabButtons.forEach(function(tabButton) {
        tabButton.addEventListener('click', function() {
            var monthIndex = tabButton.getAttribute('data-month');

            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            tabButton.classList.add('active');

            months.forEach(function(month) {
                month.classList.remove('active');
            });
            document.querySelector('.month[data-month="' + monthIndex + '"]').classList.add('active');
        });
    });

    var dayButtons = document.querySelectorAll('.days button');
    dayButtons.forEach(function(dayButton) {
        dayButton.addEventListener('click', function() {
            if (selectedDay) {
                selectedDay.classList.remove('selected');
            }
            selectedDay = dayButton;
            selectedDay.classList.add('selected');
        });
    });

    var btnSolicitar = document.getElementById('btnSolicitar');
    btnSolicitar.addEventListener('click', function() {
        if (selectedDay) {
            var selectedDate = selectedDay.textContent + ' ' + document.querySelector('.tab-btn.active').textContent;
            alert('Horário solicitado para: ' + selectedDate);
            document.getElementById('modalMarcarHorarioMentor').style.display = "none";
        } else {
            alert('Por favor, selecione um dia.');
        }
    });
    //fim do modal Marcar Horario com Mentor

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
    }
    // Fim do Modal Ranking
});
