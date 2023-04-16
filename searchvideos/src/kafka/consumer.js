const { Kafka } = require('kafkajs')
const {
	KAFKA_CONSUMER,
	KAFKA_BROKER,
	KAFKA_TOPIC_METADATA,
	KAFKA_TOPIC_METADATA_UPDATE,
	KAFKA_TOPIC_DELETE,
	KAFKA_TOPIC_MEDIA,
} = require('../config')
const { saveData, updateData, deleteData } = require('../repository/videos')
const clientId = KAFKA_CONSUMER
const kafka = new Kafka({
	clientId,
	brokers: [KAFKA_BROKER],
})

let consumer

const initKafkaListeners = async () => {
	try {
		const admin = kafka.admin()
		const topics = await admin.listTopics()
		/* istanbul ignore else */
		if(topics.indexOf(KAFKA_TOPIC_METADATA) === -1) {
			await admin.createTopics({
				waitForLeaders: true,
				topics: [
					{ topic: KAFKA_TOPIC_MEDIA },
					{ topic: KAFKA_TOPIC_METADATA },
					{ topic: KAFKA_TOPIC_METADATA_UPDATE },
					{ topic: KAFKA_TOPIC_DELETE },
				],
			})
		};
	} catch (err) {
		console.log('', err)
	}
	/* istanbul ignore else */
	if (!consumer) {
		consumer = kafka.consumer({ groupId: clientId })
		await consumer.connect()
	}
	await consumer.subscribe({ topic: KAFKA_TOPIC_METADATA, fromBeginning: true })
	await consumer.subscribe({ topic: KAFKA_TOPIC_METADATA_UPDATE })
	await consumer.subscribe({ topic: KAFKA_TOPIC_DELETE })
	await consumer.run({
		eachMessage: messageReader,
	})
}

const messageReader = async ({ topic, message }) => {
	console.log(`received message on topic ${topic}: ${message.value}`)
	console.log(`received message on topic ${topic}: ${message.value}`)
	switch (topic) {
		case KAFKA_TOPIC_METADATA:
			await saveData(message.value)
			break;
		case KAFKA_TOPIC_METADATA_UPDATE:
			await updateData(message.value)
			break;
		case KAFKA_TOPIC_DELETE:
			await deleteData(message.value)
			break;
		default:
			console.log('topic not registered')
			break
	}
}

module.exports = { initKafkaListeners, messageReader }
