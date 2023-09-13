FROM node:18-alpine AS builder
LABEL authors="shaunwah"

WORKDIR /app

COPY . .

RUN npm ci
RUN npm i -g @angular/cli
RUN ng build --prod

FROM caddy:2-alpine

WORKDIR /app

COPY --from=builder /app/dist/* .

ENV PORT=4200

EXPOSE ${PORT}

ENTRYPOINT caddy file-server --listen :${PORT} --root /app
