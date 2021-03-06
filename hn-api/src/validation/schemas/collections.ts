export const createCollectionSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      ownerId: { type: 'string' },
    },
    required: ['name', 'ownerId'],
    additionalProperties: false,
  },
};

export const getCollectionByIdSchema = {
  params: {
    type: 'object',
    properties: {
      collectionId: { type: 'string' }, // TODO: add uuid format (predecessor implement custom validator in ajv)
    },
    required: ['collectionId'],
    additionalProperties: false,
  },
};
