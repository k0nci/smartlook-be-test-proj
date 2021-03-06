import express from 'express';
import bodyParser from 'body-parser';
import middlewares from './middlewares';

// Routes
import { router as livez } from './routes/livez';

const NODE_ENV = process.env.NODE_ENV;

export const app = express();

app.use(middlewares.reqLogger());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/livez', livez);

app.use(middlewares.notFound());

app.use(middlewares.error(NODE_ENV));