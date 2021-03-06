import { Story } from "@smartlook/models/Story";
import { ResultSet } from "../PgBase";

export function deserializeStories(resultSet: ResultSet): Story[] {
  return resultSet.map((row) => ({
    id: row.id,
    author: row.author,
    createdAt: new Date(row.created_at).getTime(),
    title: row.title,
    kids: row.kids,
    url: row.url,
  }));
}

type StorySerialized = {
  id: number;
  author: string;
  created_at: Date;
  title: string;
  kids: number[];
  url: string | null;
};

export function serializeStories(stories: Story[]): StorySerialized[] {
  return stories.map((one) => ({
    id: one.id,
    author: one.author,
    created_at: new Date(one.createdAt),
    title: one.title,
    kids: one.kids,
    url: one.url,
  }));
}
