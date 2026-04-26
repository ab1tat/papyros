FROM node:20-alpine AS build
WORKDIR /app
ARG BUILD_MODE=production

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build:${BUILD_MODE}

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf