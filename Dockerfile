FROM node:16

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000
EXPOSE 5000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN npm run build

CMD [ "npm", "start" ]