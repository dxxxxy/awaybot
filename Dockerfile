FROM node:24.12.0-alpine AS compile
WORKDIR /awaybot

COPY src src
COPY package*.json .
COPY tsconfig.json .

RUN npm ci
RUN npm i -g typescript
RUN tsc --skipLibCheck

FROM node:24.12.0-alpine AS production
WORKDIR /awaybot

COPY --from=compile /awaybot/dist .
COPY package*.json .

RUN npm ci --only=production

WORKDIR /awaybot/

CMD [ "node", "app.js" ]