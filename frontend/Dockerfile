From node:18.16.0-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM node:18.16.0-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]