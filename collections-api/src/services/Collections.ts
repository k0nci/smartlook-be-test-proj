import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@smartlook/models/Collection';
import { CollectionWithStories } from '@smartlook/models/CollectionWithStories';
import { CollectionsRepository } from '@smartlook/repositories/Collections';
import { StoriesRepository } from '@smartlook/repositories/Stories';

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
  constructor(private collectionsRepo: CollectionsRepository, private storiesRepo: StoriesRepository) {}

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

  async getCollectionByIdWithStories(agentId: string, id: string): Promise<CollectionWithStories> {
    const collection = await this.collectionsRepo.getOne({ id });
    if (!collection) {
      throw new Error(CollectionsServiceErr.COLLECTION_NOT_FOUND);
    }
    if (collection.ownerId !== agentId) {
      throw new Error(CollectionsServiceErr.FORBIDDEN);
    }

    const collectionStories = await this.storiesRepo.getAll({ collectionId: id });
    return {
      ...collection,
      stories: collectionStories,
    };
  }

  async updateCollectionWithId(agentId: string, collectionId: string, data: UpdateCollectionData): Promise<Collection> {
    const collection = await this.collectionsRepo.getOne({ id: collectionId });
    if (!collection) {
      throw new Error(CollectionsServiceErr.COLLECTION_NOT_FOUND);
    }
    if (collection.ownerId !== agentId) {
      throw new Error(CollectionsServiceErr.FORBIDDEN);
    }

    collection.name = data.name;
    await this.collectionsRepo.updateOne(collection);
    return collection;
  }
}
