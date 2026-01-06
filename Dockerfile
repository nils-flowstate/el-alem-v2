# Phase 1: Bauen der App
FROM node:20-alpine AS build
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren und builden
COPY . .
RUN npm run build

# Phase 2: Bereitstellen mit Nginx
FROM nginx:alpine

# Kopiere die gebauten Dateien aus Phase 1
# Wichtig: Der Pfad muss zum 'outDir' in deiner vite.config.ts passen
COPY --from=build /app/dist/public /usr/share/nginx/html

# Nginx Konfiguration direkt im Dockerfile schreiben
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
