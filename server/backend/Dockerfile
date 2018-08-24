FROM node:8.1.2
LABEL maintainer "devops@neoskop.de"

WORKDIR /home/node
COPY *.json ./
RUN chown -R node:node /home/node
USER node
RUN npm install
COPY src ./src
RUN npm run build

CMD ["npm","start"]
EXPOSE 8080
