# client/Dockerfile

FROM node:18-alpine as build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

# Optionally write it to a .env file if Vite expects it from file:
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80