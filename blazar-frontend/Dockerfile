# develop stage
FROM --platform=linux/amd64 node:16.20.0-alpine as develop-stage

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --location=global @vue/cli
RUN npm install --location=global @quasar/cli

COPY . .

ENV PATH node_modules/.bin:$PATH

# build stage
FROM develop-stage as build-stage

RUN quasar build -m spa
# production stage
FROM nginx:1.17.5-alpine as production-stage

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

COPY ./entrypoint.sh /

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
