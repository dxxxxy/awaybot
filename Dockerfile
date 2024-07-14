FROM node:18.16.0-alpine AS compile
WORKDIR /awaybot

COPY src src
COPY package*.json .
COPY tsconfig.json .

RUN npm ci
RUN npm i -g typescript
RUN tsc --skipLibCheck

FROM node:18.16.0-alpine as production
WORKDIR /awaybot

COPY --from=compile /awaybot/dist dist
COPY package*.json .

RUN npm ci --only=production
RUN npm i -g pm2

WORKDIR /awaybot/dist

CMD [ "pm2", "start", "app.js", "--name", "awaybot", "--attach" ]