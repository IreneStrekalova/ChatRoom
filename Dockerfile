FROM node:14.13.1-alpine3.12

WORKDIR /var/www/html
COPY . ./

RUN npm install -g

CMD ["npm", "start"]