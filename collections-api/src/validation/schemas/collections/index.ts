export const createCollectionSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
    },
    required: ['name'],
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

export const updateCollectionByIdSchema = {
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
      name: { type: 'string', minLength: 1 },
    },
    required: ['name'],
    additionalProperties: false,
  },
};

export const deleteCollectionByIdSchema = {
  params: {
    type: 'object',
    properties: {
      collectionId: { type: 'string' },
    },
    required: ['collectionId'],
    additionalProperties: false,
  },
};
