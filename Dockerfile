# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

USER node

EXPOSE 3000
EXPOSE 9229

CMD ["node", "--inspect=0.0.0.0", "main.js"]
