FROM node:8.1.2
LABEL maintainer "devops@neoskop.de"

ENV DOCKERIZE_VERSION=v0.4.0 \
    ENDPOINT_TEST_URL=http://backend:8080

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 && \
    echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list && \
    apt-get -qq update && \
    apt-get -qq install mongodb-org-tools && \
    apt-get -qq clean && \
    wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /home/node

COPY *.json ./
RUN chown -R node:node /home/node
USER node

RUN npm install

COPY test-data ./test-data
COPY src ./src
COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm","run","test"]