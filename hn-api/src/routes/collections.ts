import { Router } from 'express';
import middlewares from '../middlewares';
import { CollectionsServiceErr } from '../services/Collections';
import { getLogger } from '../utils';
import { HttpError } from '../utils/errors/HttpError';
import { InternalServerError } from '../utils/errors/InternalServerError';
import { createCollectionSchema, getCollectionByIdSchema } from '../validation/schemas/collections';
import { CreateCollectionBody, GetCollectionByIdParams } from '../validation/types/collections';

const LOGGER = getLogger();

export const router = Router();

router.post<any, any, CreateCollectionBody>(
  '/',
  middlewares.validate(createCollectionSchema),
  async (req, res, next) => {
    const app = req.app;

    try {
      const collection = await app.services.collections.createCollection(req.body);
      return res.status(200).json(collection);
    } catch (err) {
      let httpErr: HttpError;
      switch (err) {
        case CollectionsServiceErr.COLLECTION_EXISTS: {
          httpErr = new HttpError(CollectionsServiceErr.COLLECTION_EXISTS, 409);
          break;
        }
        default: {
          LOGGER.error(err);
          httpErr = new InternalServerError();
          break;
        }
      }
      return next(httpErr);
    }
  }
);

router.get<GetCollectionByIdParams>(
  '/:collectionId',
  middlewares.validate(getCollectionByIdSchema),
  async (req, res, next) => {
    const app = req.app;

    const { collectionId } = req.params;

    try {
      const collection = await app.services.collections.getCollectionById(collectionId);
      return res.status(200).json(collection);
    } catch (err) {
      let httpErr: HttpError;
      switch (err.message) {
        case CollectionsServiceErr.COLLECTION_NOT_FOUND: {
          httpErr = new HttpError(CollectionsServiceErr.COLLECTION_NOT_FOUND, 404);
          break;
        }
        default: {
          LOGGER.error(err);
          httpErr = new InternalServerError();
          break;
        }
      }
      return next(httpErr);
    }
  }
);
