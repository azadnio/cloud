FROM node:7.2.0-alpine
WORKDIR /app
ADD . /app
COPY . /app
EXPOSE 8080
CMD node app.js
