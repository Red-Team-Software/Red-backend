FROM node:19-alpine3.15 AS prod-deps
WORKDIR /app
COPY package.json .
RUN npm i -prod

FROM node:19-alpine3.15 AS builder
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

FROM node:19-alpine3.15
EXPOSE 3000
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]