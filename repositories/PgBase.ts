import { Knex } from 'knex';

export type PgPool = Knex;
export type ResultSet = any[];

export abstract class PgRepository<T> {

  constructor(
    protected pool: PgPool,
    protected tableName: string,
    protected serialize: (entity: T[]) => any[],
    protected deserialize: (row: ResultSet) => T[]
  ) { }

  abstract getOne(by: { [key: string]: any }): Promise<T | null>;
  
  async insertOne(entity: T): Promise<void> {
    const entitiesSerialized = this.serialize([entity]);
    return this.pool.insert(entitiesSerialized).into(this.tableName);
  };
}
