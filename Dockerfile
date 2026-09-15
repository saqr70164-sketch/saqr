FROM node:18

WORKDIR /usr/src/app

# copy package files first to leverage docker cache
COPY package.json ./

RUN npm install --production

# copy app source
COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
