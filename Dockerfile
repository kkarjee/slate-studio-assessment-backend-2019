# TODO: This file must be populated so reviewer could easily run your app
FROM node:alpine

# Create app directory
WORKDIR /app

# COPY package.json .
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

# Start Node server
CMD [ "npm", "start" ]
