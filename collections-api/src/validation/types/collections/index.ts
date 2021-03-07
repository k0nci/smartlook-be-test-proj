export interface CreateCollectionBody {
  name: string;
}

export interface GetCollectionByIdParams {
  collectionId: string;
}

export interface UpdateCollectionWithIdParams {
  collectionId: string;
}

export interface UpdateCollectionWithIdBody {
  name: string;
}
