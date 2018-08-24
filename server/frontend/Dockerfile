FROM node:7.10.0
MAINTAINER Neoskop DevOps "devops@neoskop.de"

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get -qq update && \
    apt-get -qq install yarn nginx runit && \
    apt-get -qq clean
COPY docker-entrypoint.sh /
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /home/node
COPY package.json tsconfig.json yarn.lock ./
RUN chown -R node:node /home/node
USER node
RUN yarn install
COPY src ./src
COPY webpack ./webpack
RUN yarn run build
USER root

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["yarn","start"]
EXPOSE 3000
