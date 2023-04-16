require('dotenv').config()

const mockSend = jest.fn();
const mockConnect = jest.fn();
jest.mock('kafkajs', () => {
	const originalModule = jest.requireActual('kafkajs')
	return {
		__esModule: true,
		...originalModule,
		default: jest.fn(() => ''),
		Kafka: function () {
			return {
				producer: () => {
					return {
						connect: mockConnect,
						disconnect: async () => true,
						send: mockSend,
					}
				},
			}
		},
	}
})

const request = require('supertest')
const app = require('../src/app')
const {
	KAFKA_TOPIC_MEDIA,
	KAFKA_TOPIC_METADATA,
	KAFKA_TOPIC_METADATA_UPDATE,
	KAFKA_TOPIC_DELETE,
} = require('../src/config')
describe('Video upload and video status route validations', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})
	it('upload video should return 201 with file and videoId', (done) => {
		mockSend.mockResolvedValue({})
		request(app)
			.post('/api/v1/video/upload')
			.field('videoId', 'video_001')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.attach('file', 'test/assets/sampleVideo.mp4')
			.expect(201)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'video entry created',
					status: 'success',
				})
				expect(mockSend.mock.calls[0][0].topic).toEqual(KAFKA_TOPIC_MEDIA)
				expect(mockSend.mock.calls[1][0].topic).toEqual(KAFKA_TOPIC_METADATA)
				done()
			})
	})

	it('upload video should return 400 without file', (done) => {
		mockSend.mockResolvedValue({})
		request(app)
			.post('/api/v1/video/upload')
			.field('videoId', 'video_001')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.expect(400)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'bad request',
					status: 'error',
				})
				expect(mockSend.mock.calls.length).toEqual(0)
				expect(mockSend.mock.calls.length).toEqual(0)
				done()
			})
	})

	it('upload video should return 400 with file of 0 size', (done) => {
		mockSend.mockResolvedValue({})
		request(app)
			.post('/api/v1/video/upload')
			.field('videoId', 'video_001')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.attach('file', 'test/assets/zeroFileSize.mp4')
			.expect(400)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'bad request',
					status: 'error',
				})
				expect(mockSend.mock.calls.length).toEqual(0)
				expect(mockSend.mock.calls.length).toEqual(0)
				done()
			})
	})
	it('upload video should return 400 without videoId', (done) => {
		mockSend.mockResolvedValue({})
		request(app)
			.post('/api/v1/video/upload')
			.attach('file', 'test/assets/sampleVideo.mp4')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.expect(400)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'bad request',
					status: 'error',
				})
				expect(mockSend.mock.calls.length).toEqual(0)
				expect(mockSend.mock.calls.length).toEqual(0)
				done()
			})
	})

	it('video metadata update tests', (done) => {
		mockSend.mockResolvedValue({})
		request(app)
			.patch('/api/v1/video/upload/video_001')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.expect(202)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'data updated',
					status: 'success',
				})
				expect(mockSend.mock.calls[0][0].topic).toEqual(
					KAFKA_TOPIC_METADATA_UPDATE
				)
				done()
			})
	})

	it('video metadata delete tests', (done) => {
		mockSend.mockResolvedValue({})
		request(app)
			.delete('/api/v1/video/upload/video_001')
			.expect(202)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'data delete request accepted',
					status: 'success',
				})
				expect(mockSend.mock.calls[0][0].topic).toEqual(KAFKA_TOPIC_DELETE)
				done()
			})
	})

	it('video upload should throw error if error in publishing message', (done) => {
		mockConnect.mockImplementation(async ()=>{throw 'some error'})
		request(app)
			.post('/api/v1/video/upload')
			.field('videoId', 'video_001')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.attach('file', 'test/assets/sampleVideo.mp4')
			.expect(500)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'Internal server error',
					status: 'error',
				})
				done()
			})
	})
	it('video update should throw error if error in publishing message', (done) => {
		mockConnect.mockImplementation(async ()=>{throw 'some error'})
		request(app)
			.patch('/api/v1/video/upload/video_001')
			.field('userId', 'userId001')
			.field('channelName', 'channelName')
			.field('tags', 'tags')
			.field('descriptions', 'descriptions')
			.field('videoLanguage', 'en')
			.field('isPrivate', false)
			.expect(500)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'Internal server error',
					status: 'error',
				})
				done()
			})
	})
	it('video delete should throw error if error in publishing message', (done) => {
		mockConnect.mockImplementation(async ()=>{throw 'some error'})
		request(app)
			.delete('/api/v1/video/upload/video_001')
			.expect(500)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'Internal server error',
					status: 'error',
				})
				done()
			})
	})
})
