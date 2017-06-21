FROM node:6-alpine

# RUN apk add --no-cache bash

COPY ./docker/package.json /package.json

RUN npm install

COPY ./public /public
COPY ./express-dev-server.js /express-dev-server.js

EXPOSE 3000

CMD ["node", "/express-dev-server.js"]
