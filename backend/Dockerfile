FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# RUN npm ci --omit=dev
RUN npm install

COPY . .

CMD ["npm", "start"]