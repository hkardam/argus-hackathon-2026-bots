# Spring Boot Backend

This is the backend server for the Argusoft Hackathon Project.

## Technologies

- Java 21
- Spring Boot 3.5.11
- Maven

## Docker Setup

The project is dockerized for both development and production environments.

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Development Environment

To run the server in development mode with live code mounting:

```bash
docker compose up server-dev
```

- Port: `8086`
- Active Profile: `dev`
- Maven dependency caching is enabled via volume mounting `~/.m2`.

### Production Build

To build and run the production version:

```bash
docker compose up server-prod --build
```

- Port: `8086`
- Active Profile: `prod`
- Uses a lightweight JRE image for deployment.

### Building Manually

**Development:**
```bash
docker build --target development -t server-dev .
docker run -p 8086:8086 -v $(pwd):/app -v ~/.m2:/root/.m2 server-dev
```

**Production:**
```bash
docker build --target production -t server-prod .
docker run -p 8086:8086 server-prod
```
