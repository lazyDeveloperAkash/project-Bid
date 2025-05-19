FROM node:22-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4006

CMD [ "npm", "start" ]