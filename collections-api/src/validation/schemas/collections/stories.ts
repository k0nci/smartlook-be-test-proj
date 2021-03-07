export const insertStoriesToCollectionSchema = {
  params: {
    type: 'object',
    properties: {
      collectionId: { type: 'string' },
    },
    required: ['collectionId'],
    additionalProperties: false,
  },
  body: {
    type: 'object',
    properties: {
      storyIds: {
        type: 'array',
        items: { type: 'number', maximum: Number.MAX_SAFE_INTEGER },
      },
    },
    required: ['storyIds'],
    additionalProperties: false,
  },
};
