const { Kafka } = require("kafkajs");
const { KAFKA_CONSUMER, KAFKA_BROKER } = require("../config");
const clientId = KAFKA_CONSUMER
const kafka = new Kafka({
	clientId,
	brokers: [KAFKA_BROKER],
})

const consumer = kafka.consumer({ groupId: clientId })
const consume = async (topic, callabck) => {
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: ({ message }) => {
			console.log(`received message: ${message.value}`)
			callabck(message.value);
		},
	})
}

module.exports = consume
