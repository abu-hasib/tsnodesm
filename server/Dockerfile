# syntax=docker/dockerfile:1
FROM node:16-alpine
# RUN apk add --no-cache python2 g++ make
WORKDIR /src
COPY . .
RUN rm -rf node_modules
RUN yarn install --production
RUN yarn add typescript
RUN yarn build
EXPOSE 8081
EXPOSE 8082
CMD ["node", "dist/index.js"]

