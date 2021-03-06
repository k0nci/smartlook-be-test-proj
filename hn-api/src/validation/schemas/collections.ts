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
