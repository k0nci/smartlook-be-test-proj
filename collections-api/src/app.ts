import express from 'express';
import bodyParser from 'body-parser';
import knex from 'knex';
import axios from 'axios';
import middlewares from './middlewares';
import { HNApiClient } from '@smartlook/api-clients/hn';

// Repositories
import { UsersRepository } from '@smartlook/repositories/Users';
import { CollectionsRepository } from '@smartlook/repositories/Collections';
import { StoriesRepository } from '@smartlook/repositories/Stories';

// Services
import { UsersService } from './services/Users';
import { CollectionsService } from './services/Collections';
import { TokensService } from './services/Tokens';
import { StoriesService } from './services/Stories';

// Routes
import { router as livezRouter } from './routes/livez';
import { router as usersRouter } from './routes/users';
import { router as collectionsRouter } from './routes/collections';
import { router as tokensRouter } from './routes/tokens';

const HN_API_URL = process.env.HN_API_URL ?? 'https://hacker-news.firebaseio.com/v0/';
const NODE_ENV = process.env.NODE_ENV;

const pgPool = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'hacker_news_stories',
    password: 'hacker_news_stories',
    database: 'hacker_news_stories',
  },
});

const hnApiClient = new HNApiClient(axios.create({
  baseURL: HN_API_URL,
  timeout: 10000,
}));

export const app = express();

const usersRepo = new UsersRepository(pgPool);
const collectionsRepo = new CollectionsRepository(pgPool);
const storiesRepo = new StoriesRepository(pgPool);

const usersService = new UsersService(usersRepo);
const storiesService = new StoriesService(hnApiClient, storiesRepo);
const collectionsService = new CollectionsService(
  collectionsRepo,
  storiesService,
  storiesRepo,
);
const tokensService = new TokensService( 
  { ACCESS_TOKEN_SECRET: 'oZLmwGq6mj&PG47s', ACCESS_TOKEN_EXPIRES_IN_SECONDS: 259200 },
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
