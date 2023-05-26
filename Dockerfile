FROM node:alpine AS compile
COPY ./src /awaybot/src
COPY ./package.json /awaybot/package.json
COPY ./tsconfig.json /awaybot/tsconfig.json
WORKDIR /awaybot
RUN npm install
RUN npm install typescript -g
RUN tsc

FROM node:alpine as production
COPY --from=compile /awaybot/dist /awaybot/dist
COPY --from=compile /awaybot/package.json /awaybot/package.json
WORKDIR /awaybot
RUN npm install
RUN npm install pm2 -g
RUN npm prune --production
CMD [ "pm2-runtime", "start", "dist/app.js" ]