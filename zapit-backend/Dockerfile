FROM eclipse-temurin:17 AS builder
LABEL authors="shaunwah"

WORKDIR /app

COPY . .

RUN ./mvnw install -DskipTests

FROM eclipse-temurin:17

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080

EXPOSE ${PORT}

ENTRYPOINT SERVER_PORT=${PORT} java -jar /app/app.jar -Dserver.port=${PORT}