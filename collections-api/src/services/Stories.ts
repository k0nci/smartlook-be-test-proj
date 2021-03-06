import { HNApiClient } from '@smartlook/api-clients/hn';
import { ItemType } from '@smartlook/api-clients/hn/models/Item';
import { Story } from '@smartlook/models/Story';
import { Transaction } from '@smartlook/repositories/PgAbstract';
import { StoriesRepository } from '@smartlook/repositories/Stories';

type FetchStoryByIdResult =
  | { id: number; data: Story; code: 'ITEM_FOUND' }
  | { id: number; code: 'ITEM_NOT_FOUND' | 'ITEM_NOT_TYPE_STORY' | 'ITEM_DELETED' };

export class StoriesService {
  constructor(private hnApiClient: HNApiClient, private storiesRepo: StoriesRepository) {}

  async fetchStoryById(id: number): Promise<FetchStoryByIdResult> {
    const item = await this.hnApiClient.getItemById(id);
    if (!item) {
      return {
        id: id,
        code: 'ITEM_NOT_FOUND',
      };
    }
    if (item.type !== ItemType.STORY) {
      return {
        id: id,
        code: 'ITEM_NOT_TYPE_STORY',
      };
    }
    if (item.deleted === true) {
      return {
        id: id,
        code: 'ITEM_DELETED',
      };
    }
    return {
      id: id,
      code: 'ITEM_FOUND',
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
