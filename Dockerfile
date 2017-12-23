FROM node:8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package* /usr/src/app/
RUN npm install --silent && npm cache clean --force
COPY . /usr/src/app
ENV NODE_ENV production
RUN npm run build

CMD [ "npm", "start" ]

EXPOSE 8080