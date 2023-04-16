
jest.mock('kafkajs', () => {
	const originalModule = jest.requireActual('kafkajs')
	return {
		__esModule: true,
		...originalModule,
		default: jest.fn(() => ''),
		Kafka: function () {
			return {
				admin: () => {
					return {
						listTopics: jest.fn().mockResolvedValueOnce([]),
						createTopics: () => {},
					}
				},
				consumer: () => {
					return {
						connect: () => {},
						subscribe: () => {},
						run: () => {},
					}
				},
			}
		},
	}
})

const mockFindArray = jest.fn()
const mockFindOne = jest.fn()
const mockSave = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('mongodb', () => {
	const originalModule = jest.requireActual('mongodb')
	return {
		__esModule: true,
		...originalModule,
		default: jest.fn(() => ''),
		MongoClient: function () {
			return {
				connect: jest.fn(),
				close: () => {},
				db: () => {
					return {
						listCollections: () => ({
							toArray: jest.fn().mockResolvedValue([]),
						}),
						createCollection: jest.fn(),
						collection: jest.fn().mockImplementation(async () => {
                            console.log('collection method called...');
							return {
								createIndex: jest.fn().mockResolvedValue([]),
								find: () => {
                                    return {
                                        toArray: mockFindArray
                                    }
                                },
								findOne: mockFindOne,
								findOneAndUpdate: mockUpdate,
								deleteOne: mockDelete,
								insertOne: mockSave,
							}
						}),
					}
				},
			}
		},
	}
});

module.exports = {
    mockDelete,
    mockSave,
    mockFindArray,
    mockUpdate,
	mockFindOne
}