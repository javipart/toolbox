FROM node:14-alpine

RUN npm install -g serve

EXPOSE 3001

WORKDIR /app
COPY . .

RUN npm install

CMD ["npm", "start"]
