import { Comment } from "@smartlook/models/Comment";
import { ResultSet } from "../pg.repository";

export function deserializeComments(resultSet: ResultSet): Comment[] {
  return resultSet.map((row) => ({
    id: row.id,
    author: row.author,
    createdAt: row.created_at,
    content: row.content,
    parent: row.parent,
    kids: row.kids,
  }));
}