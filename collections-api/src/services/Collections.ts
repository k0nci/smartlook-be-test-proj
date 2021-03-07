import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@smartlook/models/Collection';
import { CollectionWithStories } from '@smartlook/models/CollectionWithStories';
import { CollectionsRepository } from '@smartlook/repositories/Collections';
import { StoriesRepository } from '@smartlook/repositories/Stories';

export const enum CollectionsServiceErr {
  COLLECTION_EXISTS = 'COLLECTION_EXISTS',
  COLLECTION_NOT_FOUND = 'COLLECTION_NOT_FOUND',
}

type CreateCollectionData = {
  name: string;
  ownerId: string;
};

type UpdateCollectionData = {
  name: string;
};

export class CollectionsService {
  constructor(
    private collectionsRepo: CollectionsRepository,
    private storiesRepo: StoriesRepository,
  ) {}

  async createCollection(data: CreateCollectionData): Promise<Collection> {
    const collectionExists = await this.collectionsRepo.getOne({
      name: data.name,
      ownerId: data.ownerId,
    });
    if (collectionExists) {
      throw new Error(CollectionsServiceErr.COLLECTION_EXISTS);
    }

    const collection: Collection = {
      id: uuidv4(),
      name: data.name,
      ownerId: data.ownerId,
    };
    await this.collectionsRepo.insertOne(collection);
    return collection;
  }

  async getCollectionByIdWithStories(id: string): Promise<CollectionWithStories> {
    const collection = await this.collectionsRepo.getOne({ id });
    if (!collection) {
      throw new Error(CollectionsServiceErr.COLLECTION_NOT_FOUND);
    }
    
    const collectionStories = await this.storiesRepo.getAll({ collectionId: id });
    return {
      ...collection,
      stories: collectionStories,
    };
  }

  async updateCollectionWithId(id: string, data: UpdateCollectionData): Promise<Collection> {
    const collection = await this.collectionsRepo.getOne({ id });
    if (!collection) {
      throw new Error(CollectionsServiceErr.COLLECTION_NOT_FOUND);
    }

    collection.name = data.name;
    await this.collectionsRepo.updateOne(collection);
    return collection;
  }
}
