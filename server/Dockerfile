# Stage 1: Build
FROM maven:3.9.5-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Development
FROM maven:3.9.5-eclipse-temurin-21-alpine AS development
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
EXPOSE 8086
CMD ["mvn", "spring-boot:run"]

# Stage 3: Production
FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
