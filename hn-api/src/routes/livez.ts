import { Router } from 'express';

export const router = Router();

router.get('/', (req, res, next) => {
  return res.status(204).end();
});
