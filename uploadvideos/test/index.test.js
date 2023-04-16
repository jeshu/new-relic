require('dotenv').config()

const request = require('supertest')
const app = require("../src/app")
describe('Basic routs validations', () => {
	it('root route validation', () => {
		return request(app).get('/').expect(200);
	})
	it('health-check route validation', () => {
		return request(app).get('/health-check').expect(200);
	})

})
