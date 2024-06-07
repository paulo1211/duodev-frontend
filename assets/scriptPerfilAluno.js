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


    // Modal Selecionar Interesses
    var interessesSelecionados = new Set();
    var interesseContainer = document.getElementById('interestContainer');
    var btnAdicionarInteresse = document.getElementById('btnAdicionarInteresse');

    function carregarInteresses() {
        var interesses = [
            "Java", "C++", "JavaScript", "Python", "C#"
        ];

        interesses.forEach(function(interesse) {
            var button = document.createElement('button');
            button.className = 'btnInteresses';
            button.setAttribute('data-interesse', interesse);
            button.innerText = interesse;

            button.addEventListener('click', function() {
                var interest = button.getAttribute('data-interesse');
                if (interessesSelecionados.has(interest)) {
                    interessesSelecionados.delete(interest);
                    button.classList.remove('selected');
                } else {
                    interessesSelecionados.add(interest);
                    button.classList.add('selected');
                }
            });

            interesseContainer.appendChild(button);
        });
    }

    btnAdicionarInteresse.addEventListener('click', function() {
        if (interessesSelecionados.size > 0) {
            // enviar lista ao servidor
            console.log("Interesses selecionados:", Array.from(interessesSelecionados));
            alert("Interesses salvos com sucesso!");
            document.getElementById('modalCadastroInteresses').style.display = "none";
        } else {
            alert("Por favor, selecione pelo menos um interesse.");
        }
    });
    //fim do modal Selecionar Interesses

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
        var alunos = [
            { nome: "João", pontuacao: 150 },
            { nome: "Maria", pontuacao: 130 },
            { nome: "Carlos", pontuacao: 120 },
            { nome: "Ana", pontuacao: 110 },
            { nome: "Pedro", pontuacao: 100 }
        ];

        var rankingTable = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
        rankingTable.innerHTML = ""; 

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
    // Fim do Modal Ranking

    
});
