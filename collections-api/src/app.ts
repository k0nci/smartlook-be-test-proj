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

const NODE_ENV = process.env.NODE_ENV;
const HN_API_URL = process.env.HN_API_URL ?? 'https://hacker-news.firebaseio.com/v0/';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'oZLmwGq6mj&PG47s';
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS ?? '259200';
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ?? '14';

const POSTGRES_HOST = process.env.POSTGRES_HOST ?? '127.0.0.1';
const POSTGRES_PORT = process.env.POSTGRES_PORT ?? '5432';
const POSTGRES_USER = process.env.POSTGRES_USER ?? 'hacker_news_stories';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? 'hacker_news_stories';
const POSTGRES_DB = process.env.POSTGRES_DB ?? 'hacker_news_stories';

const pgPool = knex({
  client: 'pg',
  connection: {
    host: POSTGRES_HOST,
    port: JSON.parse(POSTGRES_PORT),
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  },
});

const hnApiClient = new HNApiClient(
  axios.create({
    baseURL: HN_API_URL,
    timeout: 10000,
  }),
);

export const app = express();

const usersRepo = new UsersRepository(pgPool);
const collectionsRepo = new CollectionsRepository(pgPool);
const storiesRepo = new StoriesRepository(pgPool);

const usersService = new UsersService(usersRepo, {
  BCRYPT_SALT_ROUNDS: JSON.parse(BCRYPT_SALT_ROUNDS),
});
const storiesService = new StoriesService(hnApiClient, storiesRepo);
const collectionsService = new CollectionsService(collectionsRepo, storiesService);
const tokensService = new TokensService({
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: JSON.parse(ACCESS_TOKEN_EXPIRES_IN_SECONDS),
});

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
