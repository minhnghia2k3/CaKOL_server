FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock* ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["yarn", "run", "start:dev"]
