require('dotenv').config()
const { mockFindArray, mockFindOne } = require('./mocks')
const request = require('supertest')
const app = require('../src/app')

describe('Search video specs suit', () => {
	beforeAll(() => {
		app.emit('event:init')
	})
	it('should retun data when search with query', (done) => {
		mockFindArray.mockReturnValue([
			{
				videoId: 'video002',
				userId: 'user0001',
				channelName: 'mychannel1',
				title: 'my video title1',
				descriptions: 'this is description1',
				tags: 'hello,video,world,1',
				videoLanguage: 'en',
				isPrivate: false,
			},
		])
		request(app)
			.get('/api/v1/search/')
			.query({ text: 'hello' })
			.expect(200)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'query success',
					status: 'success',
					data: [
						{
							videoId: 'video002',
							userId: 'user0001',
							channelName: 'mychannel1',
							title: 'my video title1',
							descriptions: 'this is description1',
							tags: 'hello,video,world,1',
							videoLanguage: 'en',
							isPrivate: false,
						},
					],
				})
				return done()
			})
	})
	it('should retun data when search without query', (done) => {
		mockFindArray.mockReturnValue([
			{
				videoId: 'video002',
				userId: 'user0001',
				channelName: 'mychannel1',
				title: 'my video title1',
				descriptions: 'this is description1',
				tags: 'hello,video,world,1',
				videoLanguage: 'en',
				isPrivate: false,
			},
		])
		request(app)
			.get('/api/v1/search/')
			.expect(200)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'query success',
					status: 'success',
					data: [
						{
							videoId: 'video002',
							userId: 'user0001',
							channelName: 'mychannel1',
							title: 'my video title1',
							descriptions: 'this is description1',
							tags: 'hello,video,world,1',
							videoLanguage: 'en',
							isPrivate: false,
						},
					],
				})
				return done()
			})
	})
	it('should retun data as empty array for query not matched', (done) => {
		mockFindArray.mockReturnValue([])
		request(app)
			.get('/api/v1/search/')
			.query({ text: 'notMatching' })
			.expect(200)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'query success',
					status: 'success',
					data: [],
				})
				return done()
			})
	})
	it('should retun video001 data when requested as for videoId', (done) => {
		mockFindOne.mockReturnValue({
			videoId: 'video001',
			userId: 'user0001',
			channelName: 'mychannel1',
			title: 'my video title1',
			descriptions: 'this is description1',
			tags: 'hello,video,world,1',
			videoLanguage: 'en',
			isPrivate: false,
		})
		request(app)
			.get('/api/v1/search/video001')
			.expect(200)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'query success',
					status: 'success',
					data: {
						videoId: 'video001',
						userId: 'user0001',
						channelName: 'mychannel1',
						title: 'my video title1',
						descriptions: 'this is description1',
						tags: 'hello,video,world,1',
						videoLanguage: 'en',
						isPrivate: false,
					},
				})
				return done()
			})
	})
	it('should retun data null for non-existing videoIds', (done) => {
		mockFindOne.mockReturnValue(null)
		request(app)
			.get('/api/v1/search/video001')
			.expect(200)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'query success',
					status: 'success',
					data: null,
				})
				return done()
			})
	})

	it('should retun error in search if some error ouccered.', (done) => {
		mockFindArray.mockImplementation(() => {
			throw 'some error'
		})
		request(app)
			.get('/api/v1/search/')
			.expect(500)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'Interna server error',
					status: 'error',
				})
				return done()
			})
	})
	it('should retun error in find by video Id if some error ouccered.', (done) => {
		mockFindOne.mockImplementation(() => {
			throw 'some error'
		})
		request(app)
			.get('/api/v1/search/video001')
			.expect(500)
			.expect('Content-Type', /json/)
			.end((err, res) => {
				expect(res.body).toEqual({
					message: 'Interna server error',
					status: 'error',
				})
				return done()
			})
	})
})
