FROM node:14

RUN mkdir /home/node/app
RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]

