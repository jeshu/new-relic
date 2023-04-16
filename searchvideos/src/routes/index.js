var express = require('express');
const { isKafkaLive } = require('../kafka/producer');
const { isMongoLive } = require('../repository/videos');
var router = express.Router();

/**
 * @swagger
 * /:
 *  get :
 *      description: Home page of servcie.
 *      responses:
 *          '200':
 *              description: A successful response
 *
 */
/* istanbul ignore next */
router.get('/', function (req, res, next) {
	res.status(200).send({ status: 'success' });
});

router.get('/health-check', function (req, res, next) {
	res.status(200).send({ status: 'success', message: 'health check passed' });
});

router.get('/ready', async function (req, res, next) {
	try {
		await isMongoLive();
		await isKafkaLive();
		res
			.status(200)
			.send({ status: 'success', message: 'rediness check passed' });
	} catch (err) {
		res.status(500).send(err);
	}
});
module.exports = router;
