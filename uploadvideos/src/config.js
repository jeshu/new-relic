module.exports = {
	APP_LOG_LEVEL: process.env.APP_LOG_LEVEL || 'dev',
	PORT: process.env.PORT || '3000',
	KAFKA_BROKER: process.env.KAFKA_BROKER,
	KAFKA_PRODUCER: process.env.KAFKA_PRODUCER || 'upload-video',
	KAFKA_CONSUMER: process.env.KAFKA_CONSUMER || 'video-preprocesser',
	KAFKA_TOPIC_MEDIA:
		process.env.KAFKA_TOPIC_MEDIA || 'vidshare-videoupload-media',
	KAFKA_TOPIC_METADATA:
		process.env.KAFKA_TOPIC_METADATA || 'vidshare-videoupload-metadata',
	KAFKA_TOPIC_METADATA_UPDATE:
		process.env.KAFKA_TOPIC_METADATA_UPDATE ||
		'vidshare-videoupload-metadata-update',
	KAFKA_TOPIC_DELETE:
		process.env.KAFKA_TOPIC_DELETE || 'vidshare-videoupload-delete',
}
