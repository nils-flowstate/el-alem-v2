# Phase 1: Build the frontend
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
# Install dependencies (including devDependencies for vite)
RUN npm install

# Copy source code
COPY . .

# Build the frontend only, ensuring relative paths
# We use npx vite build explicitly to bypass any complex build scripts
# and force relative base path for assets
RUN npx vite build --base=./

# Phase 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from build stage
# Note: Vite outputs to dist/public based on current config
COPY --from=build /app/dist/public /usr/share/nginx/html

# Custom Nginx config to handle static files and fallbacks
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    # Gzip compression\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    # Cache static assets\n\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, no-transform";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
