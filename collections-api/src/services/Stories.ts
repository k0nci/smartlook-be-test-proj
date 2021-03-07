import { HNApiClient } from '@smartlook/api-clients/hn';
import { ItemType } from '@smartlook/api-clients/hn/models/Item';
import { Story } from '@smartlook/models/Story';
import { Transaction } from '@smartlook/repositories/PgAbstract';
import { StoriesRepository } from '@smartlook/repositories/Stories';

export class StoriesService {
  constructor(private hnApiClient: HNApiClient, private storiesRepo: StoriesRepository) {}

  async fetchStoryById(id: number): Promise<{ id: number; data: Story | null; code?: string }> {
    const item = await this.hnApiClient.getItemById(id);
    if (!item) {
      return {
        id: id,
        data: null,
        code: 'ITEM_NOT_FOUND',
      };
    }
    if (item.type !== ItemType.STORY) {
      return {
        id: id,
        data: null,
        code: 'ITEM_NOT_TYPE_STORY',
      };
    }
    if (item.deleted === true) {
      return {
        id: id,
        data: null,
        code: 'ITEM_DELETED',
      };
    }
    return {
      id: id,
      data: {
        id: item.id,
        author: item.by,
        createdAt: item.time,
        title: item.title ?? '',
        kids: item.kids ?? [],
        url: item.url ?? null,
      },
    };
  }

  async upsertStories(stories: Story[], tx: Transaction | null = null): Promise<void> {
    return this.storiesRepo.upsertAll(stories, tx);
  }

  async getStoriesByCollectionId(collectionId: string): Promise<Story[]> {
    return this.storiesRepo.getAll({ collectionId });
  }
}
