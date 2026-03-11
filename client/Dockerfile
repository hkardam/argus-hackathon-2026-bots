# Stage 1: Base
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Development
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage 3: Build
FROM base AS build
RUN npm run build

# Stage 4: Production
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
