export type CreateCollectionBody = {
  name: string;
  ownerId: string; // TODO: Remove and use id of authentificated user
};

export type GetCollectionByIdParams = {
  collectionId: string;
};

export type UpdateCollectionWithIdParams = {
  collectionId: string;
};

export type UpdateCollectionWithIdBody = {
  name: string;
};
