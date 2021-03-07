import { HNApiClient } from '@smartlook/api-clients/hn';
import { ItemType } from '@smartlook/api-clients/hn/models/Item';
import { Story } from '@smartlook/models/Story';
import { StoriesRepository } from '@smartlook/repositories/Stories';

export class StoriesService {
  constructor(private hnApiClient: HNApiClient, private storiesRepo: StoriesRepository) {}

  async fetchStoryById(id: number): Promise<{ id: number; value: Story | null; code?: string }> {
    const item = await this.hnApiClient.getItemById(id);
    if (!item) {
      return {
        id: id,
        value: null,
        code: 'ITEM_NOT_FOUND',
      };
    }
    if (item.type !== ItemType.STORY) {
      return {
        id: id,
        value: null,
        code: 'ITEM_NOT_TYPE_STORY',
      };
    }
    if (item.deleted === true) {
      return {
        id: id,
        value: null,
        code: 'ITEM_DELETED',
      };
    }
    return {
      id: id,
      value: {
        id: item.id,
        author: item.by,
        createdAt: item.time,
        title: item.title ?? '',
        kids: item.kids ?? [],
        url: item.url ?? null,
      },
    };
  }

  async upsertStories(stories: Story[]): Promise<void> {
    return this.storiesRepo.upsertAll(stories);
  }
}
