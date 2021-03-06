import { Knex } from 'knex';

export type PgPool = Knex;
export type ResultSet = any[];

export abstract class PgRepository<T> {
  protected pool: PgPool;

  constructor(pool: PgPool) {
    this.pool = pool;
    
  }

  abstract getOne(by: { [key: string]: any }): Promise<T>;
  abstract insertOne(entity: T): Promise<void>;
}
