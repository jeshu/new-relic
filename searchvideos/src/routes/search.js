var express = require('express')
var router = express.Router()
const { findByVideoId, findAll } = require('../repository/videos')

/**
 * @swagger
 * /api/v1/search:
 *   get :
 *    description: Search searvice support text base search on title, description and tags.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name : text
 *        description: search text 
 *        in : query
 *        required: false
 *        type : string
 *    responses:
 *      '200': 
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              status:string
 *              message:string
 *              data:array
 *      '500': 
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              status:string
 *              message:string
 */
router.get('/search', async (req, res, next) => {
	try {
		const docs = await findAll(req.query.text)
		res
            .status(200)
            .send({ status: 'success', message: 'query success', data: docs })
    
	} catch (err) {
		console.log(err)
		res.status(500).send({ status: 'error', message: 'Interna server error' })
	}
})
/**
 * @swagger
 * /api/v1/search/{videoId}:
 *   get :
 *    description: Search searvice support text base search on title, description and tags.
 *    produces:
 *      - application/json
 *    parameters:
 *      - name : videoId
 *        description: search text 
 *        in : path
 *        required: false
 *        type : string
 *    responses:
 *      '200': 
 *        description: A successful response
 *        content:
 *          application/json:
 *            schema:
 *              status:string
 *              message:string
 *              data:object
 *      '500': 
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              status:string
 *              message:string
 */
router.get('/search/:videoId', async (req, res, next) => {
	try {
		const doc = await findByVideoId(req.params.videoId)
		res
			.status(200)
			.send({ status: 'success', message: 'query success', data: doc })
	} catch (err) {
		res.status(500).send({ status: 'error', message: 'Interna server error' })
	}
})

module.exports = router
