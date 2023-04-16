FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

ENV PORT=3000
ENV KAFKA_BROKER=localhost:29092
ENV KAFKA_PRODUCER=upload-video
ENV KAFKA_CONSUMER=video-preprocesser
ENV KAFKA_TOPIC_METADATA=vidshare-videoupload-metadata
ENV KAFKA_TOPIC_METADATA_UPDATE=vidshare-videoupload-metadata-update
ENV KAFKA_TOPIC_DELETE=vidshare-videoupload-delete
ENV PORT=3000
ENV MONGODB_URL=mongodb://root:example@localhost:27017/?authMechanism=DEFAULT
ENV MONGODB_DB_NAME=videos

COPY . .
EXPOSE 3000
CMD ["node", "bin/www"]