FROM node:22.9.0-alpine3.19

WORKDIR /app/

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_API_CLIENT='http://localhost:3000/'

CMD ["npm", "run", "dev"]