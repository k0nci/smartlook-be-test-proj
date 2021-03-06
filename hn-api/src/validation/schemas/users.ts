export const registerUserSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 10 },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  },
};
