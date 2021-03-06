export interface Item {
  id: BigInt
  deleted?: true;
  type: string;
  by: string;
  time: number;
  text?: string;
  dead?: true;
  parent?: BigInt;
  kids?: BigInt[];
  url?: string;
  title?: string;
}
