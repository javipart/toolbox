FROM node:16.20.1

RUN npm install -g serve

EXPOSE 3000

WORKDIR /app
COPY . .

RUN npm install

CMD ["npm", "start"]
