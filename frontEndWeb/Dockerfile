FROM node:15.0.1

EXPOSE 8081

WORKDIR /usr/src/front

COPY . .

RUN npm install

RUN npm install -g serve

#RUN npm run build

#CMD [ "serve", "-s", "build", "-p", "8081" ]
