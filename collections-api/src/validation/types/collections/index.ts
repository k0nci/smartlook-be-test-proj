export interface CreateCollectionBody {
  name: string;
}

export interface GetCollectionByIdParams {
  collectionId: string;
}

export interface UpdateCollectionByIdParams {
  collectionId: string;
}

export interface UpdateCollectionByIdBody {
  name: string;
}

export interface DeleteCollectionByIdParams {
  collectionId: string;
}
