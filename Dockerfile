FROM node:14-alpine

COPY . /app
WORKDIR /app
RUN  apk --no-cache add tzdata && \
  cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
  echo "Asia/Seoul" > /etc/timezone && \
  yarn --prod=false && \
  yarn build && \
  yarn --prod=true && \
  rm -rf src

CMD yarn start