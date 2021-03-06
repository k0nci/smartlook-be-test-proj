import { Story } from "@smartlook/models/Story";
import { ResultSet } from "../pg.repo";

export function deserializeStories(resultSet: ResultSet): Story[] {
  return resultSet.map((row) => ({
    id: row.id,
    author: row.author,
    createdAt: row.created_at,
    title: row.title,
    kids: row.kids,
    url: row.url,
  }));
}