FROM node:24.12.0-alpine AS build
WORKDIR /awaybot

RUN apk update
RUN apk add build-base cairo-dev pango-dev

COPY patches patches
COPY package*.json .
RUN npm ci

COPY src src
COPY tsconfig.json .
RUN npx tsc --skipLibCheck
RUN npm prune --omit=dev

FROM node:24.12.0-alpine AS production
WORKDIR /awaybot

RUN apk update
RUN apk add cairo pango

COPY --from=build /awaybot/dist .
COPY --from=build /awaybot/node_modules node_modules
COPY package*.json .

WORKDIR /awaybot/

CMD [ "node", "app.js" ]