Como rodar o projeto
=============

O projeto foi pensado para rodar no docker seja localmente ou em um servidor.
-------------

  Para rodar o projeto, basta rodar no terminal do computador e dentro da pasta do projeto:
  ```sh
  docker-compose -f nome-do-arquivo.yml up -d
  ```
ou
  ```sh
  docker compose -f nome-do-arquivo.yml
  ```
  Depende da versão do seu docker compose, se for v2 usar o com traço, se for v3 usar a com espaço.
  
  Logo depois de rodar o comando, basta acessar no navegador por http://localhost ou http://127.0.0.1
  
