import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@smartlook/models/Collection';
import { CollectionWithStories } from '@smartlook/models/CollectionWithStories';
import { CollectionsRepository } from '@smartlook/repositories/Collections';
import { StoriesService } from './Stories';
import { Story } from '@smartlook/models/Story';

export const enum CollectionsServiceErr {
  FORBIDDEN = 'FORBIDDEN',
  COLLECTION_EXISTS = 'COLLECTION_EXISTS',
  COLLECTION_NOT_FOUND = 'COLLECTION_NOT_FOUND',
}

type CreateCollectionData = {
  name: string;
};

type UpdateCollectionData = {
  name: string;
};

export class CollectionsService {
  constructor(
    private collectionsRepo: CollectionsRepository,
    private storiesService: StoriesService,
  ) {}

  async createCollection(ownerId: string, data: CreateCollectionData): Promise<Collection> {
    const collectionExists = await this.collectionsRepo.getOne({
      name: data.name,
      ownerId: ownerId,
    });
    if (collectionExists) {
      throw new Error(CollectionsServiceErr.COLLECTION_EXISTS);
    }

    const collection: Collection = {
      id: uuidv4(),
      name: data.name,
      ownerId: ownerId,
    };
    await this.collectionsRepo.insertOne(collection);
    return collection;
  }

  async getCollectionByIdAsOwner(agentId: string, collectionId: string): Promise<Collection> {
    const collection = await this.collectionsRepo.getOne({ id: collectionId });
    if (!collection) {
      throw new Error(CollectionsServiceErr.COLLECTION_NOT_FOUND);
    }
    if (collection.ownerId !== agentId) {
      throw new Error(CollectionsServiceErr.FORBIDDEN);
    }
    return collection;
  }

  async getCollectionByIdWithStories(agentId: string, collectionId: string): Promise<CollectionWithStories> {
    const collection = await this.getCollectionByIdAsOwner(agentId, collectionId);

    const collectionStories = await this.storiesService.getStoriesByCollectionId(collectionId);
    return {
      ...collection,
      stories: collectionStories,
    };
  }

  async updateCollectionWithId(agentId: string, collectionId: string, data: UpdateCollectionData): Promise<Collection> {
    const collection = await this.getCollectionByIdAsOwner(agentId, collectionId);

    collection.name = data.name;
    await this.collectionsRepo.updateOne(collection);
    return collection;
  }

  async insertStoriesToCollection(
    agentId: string,
    collectionId: string,
    storyIds: number[],
  ): Promise<{ errors: Array<{ storyId: number; code: string }> }> {
    const collection = await this.getCollectionByIdAsOwner(agentId, collectionId);

    const stories = await Promise.all(
      storyIds.map(async (storyId) => this.storiesService.fetchStoryById(storyId)),
    );
    const errors: Array<{ storyId: number; code: string }> = [];
    const storiesFound: Story[] = [];
    for (const story of stories) {
      if (!story.value) {
        errors.push({
          storyId: story.id,
          code: story.code ?? 'ITEM_ERROR',
        });
      } else {
        storiesFound.push(story.value);
      }
    }
    await this.storiesService.upsertStories(storiesFound);
    await this.collectionsRepo.upsertStoriesToCollection(collection.id, storiesFound);
    return { errors };
  }

  async deleteCollection(agentId: string, collectionId: string): Promise<void> {
    const collection = await this.getCollectionByIdAsOwner(agentId, collectionId);
    await this.collectionsRepo.deleteOne(collection);
  }

}
