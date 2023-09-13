FROM node:18-alpine AS builder1
LABEL authors="shaunwah"

WORKDIR /app

COPY /zapit-frontend .

RUN npm ci
RUN npm i -g @angular/cli
RUN ng build

FROM eclipse-temurin:17 AS builder2

WORKDIR /app

COPY /zapit-backend .
COPY --from=builder1 /app/dist/* /app/src/main/resources/static

RUN ./mvnw install -DskipTests

FROM eclipse-temurin:17

WORKDIR /app

COPY --from=builder2 /app/target/*.jar app.jar

ENV PORT=8080

EXPOSE ${PORT}

ENTRYPOINT SERVER_PORT=${PORT} java -jar /app/app.jar -Dserver.port=${PORT}