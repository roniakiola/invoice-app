FROM node:18-alpine as base
WORKDIR /usr/src/app
COPY --chown=node:node package*.json .

FROM base as dev
RUN npm install
COPY --chown=node:node . ./
EXPOSE 3001
CMD [ "npm", "run", "start:dev" ]

FROM dev as builder
RUN npm run build

FROM base as prod
RUN npm ci --omit=dev
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
USER node
EXPOSE 3001
CMD [ "npm", "run", "start:prod" ]