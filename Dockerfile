# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

USER node

EXPOSE 3000
EXPOSE 9229

CMD ["npx", "nodemon", "-L", "--inspect=0.0.0.0", "main.js"]
