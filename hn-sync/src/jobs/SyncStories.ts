import { HNApiClient } from '@smartlook/api-clients/hn';
import { ItemType } from '@smartlook/api-clients/hn/models/Item';
import { Story } from '@smartlook/models/Story';
import { StoriesRepository } from '@smartlook/repositories/Stories';
import path from 'path';
import { getLogger } from '../utils/logger';

const FILE_NAME = path.parse(path.basename(__filename)).name;
const LOGGER = getLogger(FILE_NAME);

export class SyncStoriesJob {
  readonly JOB_NAME = 'sync-stories';
  readonly JOB_ENABLED = process.env.SYNC_COMMENTS_ENABLED ?? true;
  readonly JOB_CRON = process.env.SYNC_COMMENTS_CRON ?? '* * * * *';

  constructor(private hnApiClient: HNApiClient, private storiesRepo: StoriesRepository) {}

  async run(): Promise<void> {
    // TODO: Change to get stories in batches
    const stories = await this.storiesRepo.getAll();
    const syncResults = await Promise.allSettled(stories.map(async (one) => this.syncStory(one)));

    let updatedStories = 0;
    let deletedStories = 0;
    for (const syncRes of syncResults) {
      if (syncRes.status === 'fulfilled') {
        if (syncRes.value === 'UPDATED') {
          updatedStories++;
        } else if (syncRes.value === 'DELETED') {
          deletedStories++;
        }
      } else {
        LOGGER.error(syncRes.reason);
      }
    }
    LOGGER.info(`Successfully updated ${updatedStories} stories and deleted ${deletedStories} stories`);
  }

  async syncStory(story: Story): Promise<'DELETED' | 'UPDATED'> {
    const storyFound = await this.fetchStory(story);
    if (!storyFound) {
      await this.storiesRepo.deleteAll({ id: story.id });
      return 'DELETED';
    } else {
      await this.storiesRepo.upsertOne(storyFound);
      return 'UPDATED';
    }
  }

  async fetchStory(story: Story): Promise<Story | null> {
    const item = await this.hnApiClient.getItemById(story.id);
    if (!item || item.deleted === true || item.type !== ItemType.STORY) {
      return null;
    }
    return {
      id: item.id,
      author: item.by,
      createdAt: item.time,
      kids: item.kids ?? [],
      title: item.title ?? '',
      url: item.url ?? null,
    };
  }

}
