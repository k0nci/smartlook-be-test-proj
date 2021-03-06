import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@smartlook/models/Collection';
import { CollectionsRepository } from '@smartlook/repositories/Collections';

export const enum CollectionsServiceErr {
  COLLECTION_EXISTS = 'COLLECTION_EXISTS',
}

type CreateCollectionData = {
  name: string;
  ownerId: string;
};

export class CollectionsService {
  constructor(
    private collectionsRepo: CollectionsRepository,
  ) { }

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

  async getCollectionById(id: string): Promise<Collection> {
    return this.collectionsRepo.getOne({ id });
  }
}
