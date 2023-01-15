FROM node:16-alpine AS met-hub
RUN apk add --no-cache libc6-compat 
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/be/main.js /app/
CMD ["node", "/app/main.js"]

FROM node:16-alpine AS met-hub-store
RUN apk add --no-cache libc6-compat 
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY dist/be/store.js /app/
CMD ["node", "/app/store.js"]

FROM nginx:latest AS met-hub-nginx
COPY dist/fe/* /usr/share/nginx/html/
COPY public/* /usr/share/nginx/html/
COPY default-local.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /usr/share/nginx/html/ /usr/share/nginx/html/callback
RUN ln -sf /usr/share/nginx/html/ /usr/share/nginx/html/go
