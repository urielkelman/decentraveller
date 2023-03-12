FROM node:14-slim
COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get install -y git
RUN yarn install --non-interactive --frozen-lockfile
RUN yarn hardhat compile