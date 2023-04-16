class VideoMetadata {
	constructor(data) {
		this.userId = data.userId
		this.videoId = data.videoId
		this.channelName = data.channelName
		this.title = data.title
		this.descriptions = data.descriptions
		this.tags = data.tags
		this.videoLanguage = data.videoLanguage
		this.isPrivate = data.isPrivate
		this.createdTime = data.createdTime
		this.lastModifiedTime = new Date().toISOString();
	}
}

module.exports = VideoMetadata
