import { RequestHandler } from 'express';
import { ValidationError } from '../utils/errors/ValidationError';
import { Schema, Validator } from '../utils/validator';
import { parseErrors } from '../utils/validator/errors';

const validator = new Validator();

const defaultReqSchema: Readonly<Schema> = {
  type: 'object',
  properties: {
    query: { }, // Empty schema acts as any
    params: { },
    body: { },
    headers: { },
  },
};

export type IRequestSchema = {
  query?: Schema;
  params?: Schema;
  body?: Schema;
  headers?: Schema;
};

export function middleware(schema: IRequestSchema): RequestHandler {
  const reqSchema = {
    ...defaultReqSchema,
    properties: {
      query: schema.query || defaultReqSchema.properties.query,
      params: schema.params || defaultReqSchema.properties.params,
      body: schema.body || defaultReqSchema.properties.body,
      headers: schema.headers || defaultReqSchema.properties.headers,
    },
  };
  // Compile schema to validate function
  const validateFunction = validator.compile(reqSchema);

  return (req, res, next) => {
    const reqData = {
      query: req.query,
      params: req.params,
      body: req.body,
      headers: req.headers,
    };

    // Validate request data
    validateFunction(reqData);
    // Get errors from validate function
    const errors = validateFunction.errors || [];
    const validationErrors = parseErrors(errors);

    if (validationErrors.length !== 0) {
      const err = new ValidationError(validationErrors);
      return next(err);
    }
    return next();
  };
}
