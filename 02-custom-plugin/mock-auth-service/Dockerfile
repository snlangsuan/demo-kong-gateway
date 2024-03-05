FROM node:20-alpine3.19 AS builder
WORKDIR /app
COPY . .
RUN yarn && yarn build

FROM node:20-alpine3.19
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
CMD ["yarn", "start"]
