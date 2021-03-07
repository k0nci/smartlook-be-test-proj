import { Comment } from '@smartlook/models/Comment';
import { ResultSet } from '../PgAbstract';

export function deserializeComments(resultSet: ResultSet): Comment[] {
  return resultSet.map((row) => ({
    id: row.id,
    author: row.author,
    createdAt: new Date(row.created_at).getTime(),
    content: row.content,
    parent: row.parent,
    kids: row.kids,
  }));
}

type CommentSerialized = {
  id: number;
  author: string;
  created_at: Date;
  content: string;
  parent: number;
  kids: number[];
};

export function serializeComments(comments: Comment[]): CommentSerialized[] {
  return comments.map((one) => ({
    id: one.id,
    author: one.author,
    created_at: new Date(one.createdAt),
    content: one.content,
    parent: one.parent,
    kids: one.kids,
  }));
}
