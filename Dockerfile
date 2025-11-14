FROM node:24.11.1-alpine AS compile
WORKDIR /awaybot

COPY src src
COPY package*.json .
COPY tsconfig.json .

RUN npm ci
RUN npm i -g typescript
RUN tsc --skipLibCheck

FROM node:24.11.1-alpine as production
WORKDIR /awaybot

COPY --from=compile /awaybot/dist dist
COPY package*.json .

RUN npm ci --only=production

WORKDIR /awaybot/dist

CMD [ "npm", "start" ]