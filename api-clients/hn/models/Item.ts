export interface Item {
  id: number;
  deleted?: true;
  type: ItemType;
  by: string;
  time: number;
  text?: string;
  dead?: true;
  parent?: number;
  kids?: number[];
  url?: string;
  title?: string;
}

export const enum ItemType {
  STORY = 'story',
  COMMENT = 'comment',
}
