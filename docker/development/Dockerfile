FROM node:7-alpine

WORKDIR /app
COPY package.json .
RUN npm install --build-from-source --registry=https://registry.npm.taobao.org \
                --disturl=https://npm.taobao.org/mirrors/node \
                --production && \
    npm cache clean && rm package.json
EXPOSE 3000
