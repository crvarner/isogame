FROM node:14.14.0

WORKDIR /app
COPY package*.json ./
CMD ["npm", "install"]
COPY . .
CMD ["npm", "start"]
