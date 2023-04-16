const { Kafka } = require('kafkajs');
const { KAFKA_PRODUCER, KAFKA_BROKER } = require('../config');
const kafka = new Kafka({
	clientId: KAFKA_PRODUCER,
	brokers: [KAFKA_BROKER],
});
const producer = kafka.producer();

const produce = async (topic, data) => {
	await producer.connect();
	try {
		await producer.send({
			topic,
			messages: [
				{
					key: String(Math.random() * 10000000),
					value: data,
				},
			],
		});
	} finally {
		producer.disconnect();
	}
};

const isKafkaLive = async () => {
	try {
		await producer.connect();
	} finally {
		producer.disconnect();
	}
};

module.exports = { produce, isKafkaLive };
