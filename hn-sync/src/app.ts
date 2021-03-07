import { CommentsRepository } from '@smartlook/repositories/Comments';
import { StoriesRepository } from '@smartlook/repositories/stories';
import axios from 'axios';
import { CronJob } from 'cron';
import knex from 'knex';
import { HNApiClient } from '../../api-clients/hn';
import { SyncCommentsJob } from './jobs/SyncComments';

const HN_API_URL = process.env.HN_API_URL ?? 'https://hacker-news.firebaseio.com/v0/';

const hnApiClient = new HNApiClient(axios.create({
  baseURL: HN_API_URL,
  timeout: 10000,
}));

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

const storiesRepo = new StoriesRepository(dbPool);
const commentsRepo = new CommentsRepository(dbPool);

const JOBS_TO_RUN = [
  new SyncCommentsJob(hnApiClient, storiesRepo, commentsRepo),
];

for (const job of JOBS_TO_RUN) {
  if (!job.JOB_ENABLED) {
    continue;
  }
  const cronJob = new CronJob(job.JOB_CRON, async () => {
    console.log(`Job ${job.JOB_NAME} started`);
    await job.run();
    console.log(`Job ${job.JOB_NAME} finished`);
  });
  cronJob.start();
}
