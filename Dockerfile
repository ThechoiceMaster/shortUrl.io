FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

ENV DB_HOST=database
ENV DB_PORT=3306
ENV DB_USER=citizix_user
ENV DB_PASS=secret
ENV DB_DATABASE=citizix_db
ENV APP_PORT=3000

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]