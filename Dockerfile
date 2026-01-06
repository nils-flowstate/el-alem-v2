FROM nginx:alpine

# 1. Kopiere zuerst alles aus client (index.html, assets etc.)
COPY client/ /usr/share/nginx/html/

# 2. Kopiere nun den INHALT von public direkt nach html
# Das sorgt dafür, dass aus 'public/uploads' einfach nur 'uploads' wird
COPY client/public/ /usr/share/nginx/html/

# Deine Nginx Config (unverändert lassen)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, no-transform";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
