import { StoriesRepository } from '@smartlook/repositories/src/stories.repo';
import axios from 'axios';
import { CronJob } from 'cron';
import knex from 'knex';
import { HNApiClient } from './clients/hn-api.client';
import { SyncStoriesAndComments } from './jobs/sync-stories-and-comments.ts';

const HN_API_URL = process.env.HN_API_URL || 'https://hacker-news.firebaseio.com/v0/';

const apiClient = axios.create({
  baseURL: HN_API_URL,
  timeout: 1000,
});
const hnApiClient = new HNApiClient(apiClient);

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
const storiesRepo = new StoriesRepository(dbPool);


const RUNNING_JOBS = [
  new SyncStoriesAndComments(hnApiClient, storiesRepo),
];

for (const job of RUNNING_JOBS) {
  const cronJob = new CronJob(job.JOB_CRON, () => {
    job.run();
  });
  cronJob.start()
}
