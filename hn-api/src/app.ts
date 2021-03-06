import express from 'express';
import bodyParser from 'body-parser';
import knex from 'knex';
import middlewares from './middlewares';

// Routes
import { router as livez } from './routes/livez';
import { router as users } from './routes/users';

// Repositories
import { UsersRepository } from '@smartlook/repositories/Users';

// Services
import { UsersService } from './services/Users';

const NODE_ENV = process.env.NODE_ENV;

const dbPool = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port: 5432,
    user : 'hacker_news_stories',
    password : 'hacker_news_stories',
    database : 'hacker_news_stories'
  }
});

export const app = express();

const usersRepo = new UsersRepository(dbPool);

const usersService = new UsersService(usersRepo);

app.services = {
  users: usersService,
};

app.use(middlewares.reqLogger());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/livez', livez);

app.use(middlewares.notFound());

app.use(middlewares.error(NODE_ENV));