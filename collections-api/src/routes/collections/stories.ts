/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Router } from 'express';
import middlewares from '../../middlewares';
import { CollectionsServiceErr } from '../../services/Collections';
import { ForbiddenError } from '../../utils/errors/ForbiddenError';
import { HttpError } from '../../utils/errors/HttpError';
import { InternalServerError } from '../../utils/errors/InternalServerError';
import { insertStoriesToCollectionSchema } from '../../validation/schemas/collections/stories';
import {
  InsertStoriesToCollectionBody,
  InsertStoriesToCollectionParams,
} from '../../validation/types/collections/stories';

const ACCESS_TOKEN_SECRET = 'oZLmwGq6mj&PG47s';

export const router = Router({ mergeParams: true });

router.post<
  InsertStoriesToCollectionParams,
  { errors: Array<{ storyId: number; code: string }> },
  InsertStoriesToCollectionBody
>(
  '/bulk-insert',
  middlewares.authenticate(ACCESS_TOKEN_SECRET),
  middlewares.validate(insertStoriesToCollectionSchema),
  async (req, res, next) => {
    const app = req.app;

    const agent = req.user!;
    const { collectionId } = req.params;
    const { storyIds } = req.body;

    try {
      const { errors } = await app.services.collections.insertStoriesToCollection(agent.userId, collectionId, storyIds);
      return res.status(200).json({ errors });
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
          httpErr = new InternalServerError(err);
          break;
        }
      }
      return next(httpErr);
    }
  },
);
