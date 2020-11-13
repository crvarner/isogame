FROM node:14-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# run development server
FROM node:14-alpine AS dev
WORKDIR /app
COPY --from=base /app .
VOLUME /etc/isogame
CMD npm run watch


# production image built on DockerHub
FROM node:14-alpine AS build
WORKDIR /app
COPY --from=base /app .
VOLUME /etc/isogame
CMD npm start
