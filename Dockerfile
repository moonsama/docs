FROM node:18.20.7-slim as builder

WORKDIR /home/node

ADD . .

RUN chown -R node:node /home/node/

USER node

RUN yarn && yarn build

FROM nginxinc/nginx-unprivileged:1.21.6-alpine

RUN sed  -i '/^    location \/ {.*/a \        try_files $uri \/index.html;' /etc/nginx/conf.d/default.conf

COPY --from=builder /home/node/build /usr/share/nginx/html
