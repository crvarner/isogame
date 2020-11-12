FROM node:14-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:14-alpine AS build
WORKDIR /app
COPY --from=base /app .
CMD npm start


# run development server
FROM node:14-alpine AS dev
WORKDIR /app
COPY --from=base /app .
CMD npm run watch
