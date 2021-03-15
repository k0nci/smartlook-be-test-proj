import 'dotenv/config';
import { CommentsRepository } from '@smartlook/repositories/Comments';
import { StoriesRepository } from '@smartlook/repositories/stories';
import axios from 'axios';
import { CronJob } from 'cron';
import knex from 'knex';
import { HNApiClient } from '../../api-clients/hn';
import { SyncCommentsJob } from './jobs/SyncComments';
import { SyncStoriesJob } from './jobs/SyncStories';
import { getLogger } from './utils/logger';

const LOGGER = getLogger();

const HN_API_URL = process.env.HN_API_URL ?? 'https://hacker-news.firebaseio.com/v0/';
const POSTGRES_HOST = process.env.POSTGRES_HOST ?? '127.0.0.1';
const POSTGRES_PORT = process.env.POSTGRES_PORT ?? '5432';
const POSTGRES_USER = process.env.POSTGRES_USER ?? 'hacker_news_stories';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? 'hacker_news_stories';
const POSTGRES_DB = process.env.POSTGRES_DB ?? 'hacker_news_stories';

const hnApiClient = new HNApiClient(
  axios.create({
    baseURL: HN_API_URL,
    timeout: 10000,
  }),
);

const pgPool = knex({
  client: 'pg',
  connection: {
    host: POSTGRES_HOST,
    port: JSON.parse(POSTGRES_PORT),
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
  },
  pool: { min: 1, max: 20 },
});

const storiesRepo = new StoriesRepository(pgPool);
const commentsRepo = new CommentsRepository(pgPool);

const JOBS_TO_RUN = [
  new SyncCommentsJob(hnApiClient, storiesRepo, commentsRepo),
  new SyncStoriesJob(hnApiClient, storiesRepo, commentsRepo),
];

const runningJobs = [];
for (const job of JOBS_TO_RUN) {
  if (!job.JOB_ENABLED) {
    continue;
  }
  const cronJob = new CronJob(job.JOB_CRON, async () => {
    LOGGER.info(`Job '${job.JOB_NAME}' started`);
    await job.run();
    LOGGER.info(`Job '${job.JOB_NAME}' finished`);
  });
  cronJob.start();

  runningJobs.push(cronJob);
}

LOGGER.info(`Started ${runningJobs.length}/${JOBS_TO_RUN.length} jobs`);
