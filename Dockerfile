# STAGE 1
FROM node:16-alpine as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm config set unsafe-perm true
# RUN npm install typescript
# RUN npm install ts-node
# RUN npm install prisma
RUN npm install

COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build

# STAGE 2
FROM node:16-alpine
RUN apk add --no-cache tzdata && \
    echo "Europe/Budapest" >  /etc/timezone && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
# RUN npm install --save-dev sequelize-cli
RUN npm install --production
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules/.prisma ./node_modules/.prisma

# COPY --chown=node:node .env .
# # COPY --chown=node:node .sequelizerc .
# COPY --chown=node:node  /config ./config
# COPY --chown=node:node  /public ./public


# RUN npm run migrate
# RUN npx sequelize db:seed:all; exit 0
# RUN npm un sequelize-cli

EXPOSE 8081
CMD [ "node", "dist/server.js" ]