import express from 'express';
import bodyParser from 'body-parser';
import knex from 'knex';
import middlewares from './middlewares';

// Repositories
import { UsersRepository } from '@smartlook/repositories/Users';
import { CollectionsRepository } from '@smartlook/repositories/Collections';

// Services
import { UsersService } from './services/Users';
import { CollectionsService } from './services/Collections';

// Routes
import { router as livezRouter } from './routes/livez';
import { router as usersRouter } from './routes/users';
import { router as collectionsRouter } from './routes/collections';
import { router as tokensRouter } from './routes/tokens';
import { TokensService } from './services/Tokens';

const NODE_ENV = process.env.NODE_ENV;

const dbPool = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'hacker_news_stories',
    password: 'hacker_news_stories',
    database: 'hacker_news_stories',
  },
});

export const app = express();

const usersRepo = new UsersRepository(dbPool);
const collectionsRepo = new CollectionsRepository(dbPool);

const usersService = new UsersService(usersRepo);
const collectionsService = new CollectionsService(collectionsRepo);
const tokensService = new TokensService(
  usersService, 
  { ACCESS_TOKEN_SECRET: 'oZLmwGq6mj&PG47s', ACCESS_TOKEN_EXPIRES_IN_SECONDS: 1440 },
);

app.services = {
  users: usersService,
  collections: collectionsService,
  tokens: tokensService,
};

app.use(middlewares.reqLogger());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/livez', livezRouter);
app.use('/collections', collectionsRouter);
app.use('/tokens', tokensRouter);

app.use(middlewares.notFound());

app.use(middlewares.error(NODE_ENV));
