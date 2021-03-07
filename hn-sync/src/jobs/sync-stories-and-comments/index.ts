import { StoriesRepository } from '@smartlook/repositories/stories';
import { HNApiClient } from '@smartlook/api-clients/hn';
import { ItemType } from '@smartlook/api-clients/hn/models/Item';

export class SyncStoriesAndComments {
  readonly JOB_NAME = 'sync-stories-and-comments';
  readonly JOB_ENABLED = process.env.SYNC_STORIES_AND_COMMENTS_ENABLED ?? true;
  readonly JOB_CRON = process.env.SYNC_STORIES_AND_COMMENTS_CRON ?? '* * * * *';

  private client: HNApiClient;
  private storiesRepo: StoriesRepository;

  constructor(hnApiClient: HNApiClient, storiesRepo: StoriesRepository) {
    this.client = hnApiClient;
    this.storiesRepo = storiesRepo;
  }

  async run(): Promise<void> {
    const maxItemId = await this.client.getMaxItemId();
    for (let id = maxItemId; id > 0; id--) {
      const item = await this.client.getItemById(id);

      if (item.type === ItemType.STORY && item.deleted !== true) {
        await this.storiesRepo.insertOne({
          id: item.id,
          author: item.by,
          createdAt: item.time,
          title: item.title ?? '',
          kids: item.kids ?? [],
          url: item.url ?? null,
        });
      }
    }
  }
}
