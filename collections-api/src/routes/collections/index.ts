/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Collection } from '@smartlook/models/Collection';
import { CollectionWithStories } from '@smartlook/models/CollectionWithStories';
import { Router } from 'express';
import middlewares from '../../middlewares';
import { CollectionsServiceErr } from '../../services/Collections';
import { getLogger } from '../../utils';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import { HttpError } from '../../utils/errors/HttpError';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import {
  createCollectionSchema,
  getCollectionByIdSchema,
  updateCollectionWithIdSchema,
} from '../../validation/schemas/collections';
import {
  CreateCollectionBody,
  GetCollectionByIdParams,
  UpdateCollectionWithIdBody,
  UpdateCollectionWithIdParams,
} from '../../validation/types/collections';
import { router as storiesRouter } from './stories';

const ACCESS_TOKEN_SECRET = 'oZLmwGq6mj&PG47s';

const LOGGER = getLogger();

export const router = Router();

router.use('/:collectionId/stories', storiesRouter);

router.post<any, Collection, CreateCollectionBody>(
  '/',
  middlewares.authenticate(ACCESS_TOKEN_SECRET),
  middlewares.validate(createCollectionSchema),
  async (req, res, next) => {
    const app = req.app;

    const agent = req.user!;

    try {
      const collection = await app.services.collections.createCollection(agent.userId, req.body);
      return res.status(200).json(collection);
    } catch (err) {
      let httpErr: HttpError;
      switch (err) {
        case CollectionsServiceErr.COLLECTION_EXISTS: {
          httpErr = new HttpError(409, CollectionsServiceErr.COLLECTION_EXISTS);
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
  },
);

router.get<GetCollectionByIdParams, CollectionWithStories>(
  '/:collectionId',
  middlewares.authenticate(ACCESS_TOKEN_SECRET),
  middlewares.validate(getCollectionByIdSchema),
  async (req, res, next) => {
    const app = req.app;

    const agent = req.user!;
    const { collectionId } = req.params;

    try {
      const collection = await app.services.collections.getCollectionByIdWithStories(agent.userId, collectionId);
      return res.status(200).json(collection);
    } catch (err) {
      let httpErr: HttpError;
      switch (err.message) {
        case CollectionsServiceErr.COLLECTION_NOT_FOUND: {
          httpErr = new HttpError(404, CollectionsServiceErr.COLLECTION_NOT_FOUND);
          break;
        }
        case CollectionsServiceErr.FORBIDDEN: {
          httpErr = new ForbiddenError();
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
  },
);

router.patch<UpdateCollectionWithIdParams, any, UpdateCollectionWithIdBody>(
  '/:collectionId',
  middlewares.authenticate(ACCESS_TOKEN_SECRET),
  middlewares.validate(updateCollectionWithIdSchema),
  async (req, res, next) => {
    const app = req.app;

    const agent = req.user!;
    const { collectionId } = req.params;

    try {
      await app.services.collections.updateCollectionWithId(agent.userId, collectionId, req.body);
      return res.status(204).end();
    } catch (err) {
      let httpErr: HttpError;
      switch (err.message) {
        case CollectionsServiceErr.COLLECTION_NOT_FOUND: {
          httpErr = new HttpError(404, CollectionsServiceErr.COLLECTION_NOT_FOUND);
          break;
        }
        case CollectionsServiceErr.FORBIDDEN: {
          httpErr = new ForbiddenError();
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
  },
);
