FROM nginx:alpine
COPY TelaCadastro/ /usr/share/nginx/html
EXPOSE 80