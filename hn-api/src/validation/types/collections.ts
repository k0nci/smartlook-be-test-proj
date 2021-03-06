export type CreateCollectionBody = {
  name: string;
  ownerId: string; // TODO: Remove and use id of authentificated user
};

export type GetCollectionByIdParams = {
  collectionId: string;
};
