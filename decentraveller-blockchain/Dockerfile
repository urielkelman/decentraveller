FROM node:16-alpine3.18
RUN apk add --no-cache git
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn hardhat compile