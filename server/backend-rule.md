# Backend Formatting Rule

**Do not perform manual formatting.**
All Java code formatting must be handled using the project's automated tools:

- Run `./mvnw spotless:apply` in the `server` directory to format the code.
- Spotless will automatically apply **Google Java Format**, remove unused imports, and trim whitespace.
- Code is automatically checked during the `compile` phase of the build.
