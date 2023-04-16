require('dotenv').config()
const { mockSave, mockUpdate, mockDelete } = require('./mocks')
const app = require('../src/app')
const {
	KAFKA_TOPIC_METADATA,
	KAFKA_TOPIC_DELETE,
	KAFKA_TOPIC_METADATA_UPDATE,
} = require('../src/config')
const { messageReader } = require('../src/kafka/consumer')

describe('messaging tests', () => {
	beforeAll(() => {
		app.emit('event:init')
	})
	afterEach(() => {
		jest.clearAllMocks()
	})
	it('should call mongo save method with provided data', async () => {
		await messageReader({
			topic: KAFKA_TOPIC_METADATA,
			message: {
				value: JSON.stringify({
					videoId: 'video001',
				}),
			},
		})
		expect(mockSave.mock.calls[0][0]).toEqual({ videoId: 'video001' })
	})
	it('should call mongo update method with provided data', async () => {
		await messageReader({
			topic: KAFKA_TOPIC_METADATA_UPDATE,
			message: {
				value: JSON.stringify({
					videoId: 'video001',
					title: 'video title',
				}),
			},
		})
		expect(mockUpdate.mock.calls[0][0]).toEqual({ videoId: 'video001' })
		expect(mockUpdate.mock.calls[0][1]).toEqual({
			$set: { videoId: 'video001', title: 'video title' },
		})
	})
	it('should call mongo delete method with provided data', async () => {
		await messageReader({
			topic: KAFKA_TOPIC_DELETE,
			message: {
				value: 'video001',
			},
		})
		expect(mockDelete.mock.calls[0][0]).toEqual({videoId:'video001'})
	})
	it('should not call update/save/delete if topic not matched', async () => {
		await messageReader({
			topic: 'non topic',
			message: {
				value: JSON.stringify({
					videoId: 'video001',
				}),
			},
		})
		expect(mockSave.mock.calls.length).toBe(0)
		expect(mockDelete.mock.calls.length).toBe(0)
		expect(mockUpdate.mock.calls.length).toBe(0)
	})
})
