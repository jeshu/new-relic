FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .
ENV ENV_NAME=dev
ENV KAFKA_BROKER=localhost:29092
ENV KAFKA_PRODUCER=upload-video
ENV KAFKA_CONSUMER=video-preprocesser
ENV KAFKA_TOPIC_MEDIA=vidshare-videoupload-media
ENV KAFKA_TOPIC_METADATA=vidshare-videoupload-metadata
ENV KAFKA_TOPIC_METADATA_UPDATE=vidshare-videoupload-metadata-update
ENV KAFKA_TOPIC_DELETE=vidshare-videoupload-delete

EXPOSE 3000
CMD ["node", "bin/www"]