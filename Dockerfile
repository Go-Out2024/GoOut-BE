FROM node:18.6.0-alpine as builder


WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install pm2 -g
COPY ./ ./
ENV CHOKIDAR_USEPOLLING=true

FROM node:18.6.0-alpine
RUN apk add --no-cache tzdata

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app
COPY --from=builder /app /app

CMD ["npm", "run", "start"]