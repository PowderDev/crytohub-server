FROM node:18.12.0-alpine3.15 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:18.12.0-alpine3.15
WORKDIR /app
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.env /app/.env
CMD ["npm", "run", "start:prod"]