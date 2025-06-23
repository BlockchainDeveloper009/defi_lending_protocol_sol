FROM node:bullseye
WORKDIR /app
COPY package* ./
RUN npm i --production-only
COPY ./src ./src
COPY ./public ./public
RUN chown -R node /app/node_modules
USER node
CMD ["./docker-entrypoint.sh"]

