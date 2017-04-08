FROM node:7.8.0-slim
MAINTAINER jacob gathercole <jacobgathercole@gmail.com>

ENV BOTDIR /opt/hubot

COPY . ${BOTDIR}
WORKDIR ${BOTDIR}
RUN npm install

CMD bin/hubot -a slack
