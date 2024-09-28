FROM node:20-alpine3.20

WORKDIR /app/wikusama-hotel

COPY package* .

RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm","start"]