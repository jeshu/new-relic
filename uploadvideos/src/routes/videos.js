var express = require('express')
const {produce} = require('../kafka/producer')
var router = express.Router()
var fs = require('fs')
var multer = require('multer')
const VideoMetadata = require('../models/VideoMetadata')
const {
	KAFKA_TOPIC_DELETE,
	KAFKA_TOPIC_METADATA,
	KAFKA_TOPIC_MEDIA,
	KAFKA_TOPIC_METADATA_UPDATE,
} = require('../config')
const upload = multer({ dest: '../uploads' })

/**
 * @swagger
 * /api/v1/video/upload:
 *   post:
 *     description: video upload service.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name : videoId
 *         description: unique id for the video to be uploaded
 *         in : formdata
 *         required: true
 *         type : string
 *       - name : file
 *         description: video file
 *         in : formdata
 *         required: true
 *         type : file
 *       - name : channelName
 *         description: channelName for user's video channel, same as user  display name.
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : title
 *         description: title of the video
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : descriptions
 *         description: descriptions for the video
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : tags
 *         description: tags for the video
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : isPrivate
 *         description: check if video can be avilable to public or not.
 *         in : formdata
 *         required: false
 *         type : boolean
 *     responses:
 *       '200':
 *         description: 'A successful response'
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *       '400':
 *         description: bad request
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *       '500':
 *         description: 'Internal server error'
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
	try {
		if (!req.file || req.file.size === 0) {
			return res.status(400).send({ status: 'error', message: 'bad request' })
		}
		if (fs.existsSync(req.file.path) && req.body.videoId) {
			const videoMeta = new VideoMetadata({
				...req.body,
				createdTime: new Date(),
			})
			await produce(
				KAFKA_TOPIC_MEDIA,
				JSON.stringify({ file: req.file.path, videoId: req.body.videoId })
			)
			await produce(KAFKA_TOPIC_METADATA, JSON.stringify(videoMeta))
			res
				.status(200) // should be 200
				.send({ status: 'success', message: 'video entry created' })
		} else {
			res.status(400).send({ status: 'error', message: 'bad request' })
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: 'error', message: 'Internal server error' })
	}
})

/**
 * @swagger
 * /api/v1/video/upload/{videoId}:
 *   patch:
 *     description: video upload service.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name : videoId
 *         description: unique id for the video to be uploaded
 *         in : path
 *         required: true
 *         type : string
 *       - name : channelName
 *         description: channelName for user's video channel, same as user  display name.
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : title
 *         description: title of the video
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : descriptions
 *         description: descriptions for the video
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : tags
 *         description: tags for the video
 *         in : formdata
 *         required: false
 *         type : string
 *       - name : isPrivate
 *         description: check if video can be avilable to public or not.
 *         in : formdata
 *         required: false
 *         type : boolean
 *     responses:
 *       '202':
 *         description: 'A successful response'
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *       '500':
 *         description: 'Internal server error'
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *
 */
router.patch('/upload/:videoId', upload.none(), async (req, res, next) => {
	try {
		const videoMeta = new VideoMetadata({
			...req.body,
			videoId: req.params.videoId,
		})
		await produce(KAFKA_TOPIC_METADATA_UPDATE, JSON.stringify(videoMeta))
		res.status(202).send({ status: 'success', message: 'data updated' })
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: 'error', message: 'Internal server error' })
	}
})

/**
 * @swagger
 * /api/v1/video/upload/{videoId}:
 *   delete:
 *     description: video upload service.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name : videoId
 *         description: unique id for the video to be uploaded
 *         in : path
 *         required: true
 *         type : string
 *     responses:
 *       '202':
 *         description: 'A successful response'
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *       '500':
 *         description: 'Internal server error'
 *         content:
 *           application/json:
 *             schema:
 *               status:string
 *               message:string
 *
 */
router.delete('/upload/:videoId', upload.none(), async (req, res, next) => {
	try {
		await produce(KAFKA_TOPIC_DELETE, req.params.videoId);
		res.status(202).send({ status: 'success', message: 'data delete request accepted' })
	} catch (err) {
		console.log(err);
		res.status(500).send({ status: 'error', message: 'Internal server error' })
	}
})

module.exports = router
