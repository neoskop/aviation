FROM maven:3.5.0-jdk-8
LABEL maintainer "devops@neoskop.de"

ENV DOCKERIZE_VERSION=v0.5.0 \
    ENDPOINT_TEST_URL=http://backend:8080

RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list && \
    apt-get -qq update && \
    apt-get -qq install mongo-tools && \
    apt-get -qq clean && \
    wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY pom.xml ./
RUN mvn -q -T 1C compile && mvn -q -T 1C test-compile

COPY test-data ./test-data
COPY src ./src
COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["mvn","test"]