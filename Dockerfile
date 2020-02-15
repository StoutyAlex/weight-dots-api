FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install --production

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
