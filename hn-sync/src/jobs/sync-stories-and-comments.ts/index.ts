import { StoriesRepository } from "@smartlook/repositories/src/stories.repo";
import { HNApiClient } from "../../clients/hn-api.client";
import { ItemType } from "../../clients/hn-api.client/models/Item";

export class SyncStoriesAndComments {
  public static JOB_NAME = 'sync-stories-and-comments';

  readonly JOB_CRON = process.env.CRON_SYNC_STORIES_AND_COMMENTS || '* * * * * *';

  private client: HNApiClient;
  private storiesRepo: StoriesRepository;

  constructor(
    hnApiClient: HNApiClient,
    storiesRepo: StoriesRepository
  ) {
    this.client = hnApiClient;
    this.storiesRepo = storiesRepo;
  }

  async run(): Promise<void> {
    console.log(`Job ${SyncStoriesAndComments.JOB_NAME} started`)

    const maxItemId = await this.client.getMaxItemId();
    for (let id = maxItemId; id > 0; id--) {
      const item = await this.client.getItemById(id);
      if (item.type === ItemType.STORY) {
        await this.storiesRepo.insertOne({
          id: item.id,
          author: item.by,
          createdAt: item.time,
          title: item.title || '',
          kids: item.kids || [],
          url: item.url || null,
        });
        console.log(`Item ${item.id} inserted`)
      }
    }

    console.log(`Job ${SyncStoriesAndComments.JOB_NAME} finished`)
  }

}