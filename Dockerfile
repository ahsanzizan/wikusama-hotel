
FROM node:21-alpine

ARG user=nextjs
ARG group=nodejs
ARG usergroup=${user}:${group}
RUN adduser -u 1001 -S ${user}
RUN addgroup -g 1001 -S ${group}
USER ${user}

WORKDIR /app/NextApp

COPY package* .

RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm","start"]
