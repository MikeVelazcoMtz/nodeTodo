FROM node:latest

RUN mkdir -p /home/app
WORKDIR /home/app

COPY ./package.json /home/app

RUN npm install

COPY . /home/app

EXPOSE 3000