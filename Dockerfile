FROM node:onbuild

ONBUILD RUN npm run build

EXPOSE 8080