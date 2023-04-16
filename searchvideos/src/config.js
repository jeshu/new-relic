module.exports = {
	APP_LOG_LEVEL: process.env.APP_LOG_LEVEL || 'dev',
	PORT: process.env.PORT || 3001,
	KAFKA_BROKER: process.env.KAFKA_BROKER,
	KAFKA_CONSUMER: process.env.KAFKA_CONSUMER || 'search-video',
	KAFKA_TOPIC_METADATA:
		process.env.KAFKA_TOPIC_METADATA || 'vidshare-videoupload-metadata',
	KAFKA_TOPIC_DELETE:
		process.env.KAFKA_TOPIC_DELETE || 'vidshare-videoupload-delete',
	KAFKA_TOPIC_METADATA_UPDATE:
		process.env.KAFKA_TOPIC_METADATA_UPDATE ||
		'vidshare-videoupload-metadata-update',
	KAFKA_TOPIC_MEDIA:
		process.env.
		KAFKA_TOPIC_MEDIA || "vidshare-videoupload-media",
	MONGODB_URL: process.env.MONGODB_URL,
	MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'videos',
}
