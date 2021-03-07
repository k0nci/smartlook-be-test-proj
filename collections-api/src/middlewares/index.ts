import { middleware as notFound } from './notFound';
import { middleware as error } from './error';
import { middleware as reqLogger } from './reqLogger';
import { middleware as validate } from './validator';
import { middleware as authenticate } from './authenticate';

export default {
  notFound,
  error,
  reqLogger,
  validate,
  authenticate,
};
