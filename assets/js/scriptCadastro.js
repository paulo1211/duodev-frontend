document.addEventListener('DOMContentLoaded', function() {
    var btnLogin = document.getElementById('btnLogin');

    function validarEmail(email) {
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        let soma = 0, resto;
        if (/^(\d)\1+$/.test(cpf)) return false;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    function validarSenha(senha, confirmarSenha) {
        return senha === confirmarSenha;
    }

    function adicionarClasseInvalido(elemento) {
        elemento.classList.add('inputInvalidado');
    }

    function removerClasseInvalido(elemento) {
        elemento.classList.remove('inputInvalidado');
    }

    function validarEntradas() {
        let nome = document.getElementById('inputNome');
        let email = document.getElementById('inputEmail');
        let senha = document.getElementById('inputSenha');
        let confirmarSenha = document.getElementById('inputConfSenha');
        let cpf = document.getElementById('inputCPF');
        let genero = document.getElementById('selectGenero');
        let perfil = document.getElementById('selectPerfil');
        let dataNascimento = document.getElementById('inputDataNascimento');

        let valido = true;

        if (!nome.value.trim()) {
            adicionarClasseInvalido(nome);
            valido = false;
        } else {
            removerClasseInvalido(nome);
        }

        if (!validarEmail(email.value)) {
            adicionarClasseInvalido(email);
            valido = false;
        } else {
            removerClasseInvalido(email);
        }

        if (!validarSenha(senha.value, confirmarSenha.value)) {
            adicionarClasseInvalido(senha);
            adicionarClasseInvalido(confirmarSenha);
            valido = false;
        } else {
            removerClasseInvalido(senha);
            removerClasseInvalido(confirmarSenha);
        }

        if (!validarCPF(cpf.value)) {
            adicionarClasseInvalido(cpf);
            valido = false;
        } else {
            removerClasseInvalido(cpf);
        }

        if (!genero.value.trim()) {
            adicionarClasseInvalido(genero);
            valido = false;
        } else {
            removerClasseInvalido(genero);
        }

        if (!perfil.value.trim()) {
            adicionarClasseInvalido(perfil);
            valido = false;
        } else {
            removerClasseInvalido(perfil);
        }

        if (!dataNascimento.value) {
            adicionarClasseInvalido(dataNascimento);
            valido = false;
        } else {
            removerClasseInvalido(dataNascimento);
        }

        return valido;
    }

    btnLogin.addEventListener('click', function() {
        if (validarEntradas()) {
            let nome = document.getElementById('inputNome').value;
            let email = document.getElementById('inputEmail').value;
            let senha = document.getElementById('inputSenha').value;
            let confirmarSenha = document.getElementById('inputConfSenha').value;
            let cpf = document.getElementById('inputCPF').value;
            let genero = document.getElementById('selectGenero').value;
            let perfil = document.getElementById('selectPerfil').value;
            let dataNascimento = document.getElementById('inputDataNascimento').value;
            console.log(document.getElementById("inputDataNascimento").value);
            window.location.href = '';
        }else{
            alert("Algum campo ou alguns campos não foram preenchidos corretamente.")
        }
    });

    document.getElementById('inputCPF').addEventListener('input', function(e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) {
            cpf = cpf.slice(0, 11);
        }
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        e.target.value = cpf;
    });

    document.getElementById('inputEmail').addEventListener('input', function(e) {
        let email = e.target.value;
        if (!validarEmail(email)) {
            adicionarClasseInvalido(e.target);
        } else {
            removerClasseInvalido(e.target);
        }
    });

    document.getElementById('inputConfSenha').addEventListener('input', function(e) {
        let senha = document.getElementById('inputSenha').value;
        let confirmarSenha = e.target.value;
        if (!validarSenha(senha, confirmarSenha)) {
            adicionarClasseInvalido(e.target);
        } else {
            removerClasseInvalido(e.target);
        }
    });
});
