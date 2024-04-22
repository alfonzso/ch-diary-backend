# STAGE 1
FROM node:21-alpine3.18 as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN apk add --update --no-cache openssl1.1-compat
USER node
COPY --chown=node:node package*.json ./
RUN npm install

ARG PRISMA_ENV=cloud

COPY --chown=node:node . .
# RUN npx prisma generate --schema prisma.cloud/schema.prisma
# RUN npx prisma generate --schema prisma.local/schema.prisma
RUN echo ${PRISMA_ENV}
RUN npx prisma generate --schema prisma.${PRISMA_ENV}/schema.prisma
RUN npm run build
COPY --chown=node:node src/views /home/node/app/dist/src/views

# STAGE 2
FROM node:21-alpine3.18
RUN apk add --update --no-cache openssl1.1-compat tzdata
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./

RUN npm install --production
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8081
CMD [ "node", "dist/server.js" ]
