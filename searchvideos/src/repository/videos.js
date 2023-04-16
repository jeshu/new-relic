const { MONGODB_URL, MONGODB_DB_NAME } = require('../config');
const { MongoClient } = require('mongodb');

let client;
const COLLECTION_NAME = 'videosMetadata';
const initMongo = async () => {
	if (!client) {
		client = new MongoClient(MONGODB_URL);
	}
	try {
		await client.connect();
		const dbo = await client.db(MONGODB_DB_NAME);
		const collections = await dbo
			.listCollections({ name: COLLECTION_NAME })
			.toArray();
		/* istanbul ignore else */
		if (collections.length === 0) {
			await dbo.createCollection(COLLECTION_NAME);
			const videos = await dbo.collection(COLLECTION_NAME);
			await videos.createIndex({ videoId: 1 }, { unique: true });
			await videos.createIndex({
				title: 'text',
				description: 'text',
				tags: 'text',
			});
		}
	} catch (err) {
		console.error(err);
		//TODO : elegent handling of error
	} finally {
		await client.close();
	}
};

const isMongoLive = async () => {
	try {
		await client.connect();
	} finally {
		await client.close();
	}
};

const saveData = async (data) => {
	console.log(`savedata called - `);
	try {
		await client.connect();
		var dbo = client.db(MONGODB_DB_NAME);
		const collection = await dbo.collection(COLLECTION_NAME);
		console.log(collection);
		await collection.insertOne(JSON.parse(data));
	} catch (err) {
		console.error(err);
		//TODO : elegent handling of error
	} finally {
		await client.close();
	}
};

const updateData = async (data) => {
	try {
		await client.connect();
		const dbo = client.db(MONGODB_DB_NAME);
		const collection = await dbo.collection(COLLECTION_NAME);
		console.log(`update data: ${data}`);
		const docData = JSON.parse(data);
		await collection.findOneAndUpdate(
			{ videoId: docData.videoId },
			{ $set: { ...docData } }
		);
	} catch (err) {
		console.error(err);
	} finally {
		await client.close();
	}
};
const deleteData = async (videoId) => {
	try {
		await client.connect();
		const dbo = client.db(MONGODB_DB_NAME);
		const collection = await dbo.collection(COLLECTION_NAME);
		console.log(String(videoId));
		await collection.deleteOne({ videoId: String(videoId) });
	} catch (err) {
		console.error(err);
		//TODO : elegent handling of error
	} finally {
		await client.close();
	}
};

const findAll = async (text) => {
	try {
		await client.connect();
		const dbo = client.db(MONGODB_DB_NAME);
		const collection = await dbo.collection(COLLECTION_NAME);
		const cursor = text
			? collection.find({ $text: { $search: text } })
			: collection.find();
		const doc = await cursor.toArray();
		return doc;
	} finally {
		await client.close();
	}
};

const findByVideoId = async (videoId) => {
	try {
		await client.connect();
	} finally {
		await client.close();
	}
};

module.exports = {
	initMongo,
	saveData,
	updateData,
	deleteData,
	findAll,
	isMongoLive,
	findByVideoId,
};
