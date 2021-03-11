import { Knex } from 'knex';

export type PgPool = Knex;
export type Transaction = Knex.Transaction;
export type ResultSet = any[];

export const enum IsolationLevel {
  READ_UNCOMMITTED = 'read uncommitted',
  READ_COMMITTED = 'read committed',
  REPEATABLE_READ = 'repeatable read',
  SERIALIZABLE = 'serializable',
}

export abstract class PgRepository<T> {
  constructor(
    protected pool: PgPool,
    protected tableName: string,
    protected serialize: (entity: T[]) => any[],
    protected deserialize: (row: ResultSet) => T[],
  ) {}

  abstract getOne(by?: { [key: string]: any }, tx?: Transaction | null): Promise<T | null>;

  async insertOne(entity: T, tx: Transaction | null = null): Promise<void> {
    return this.insertAll([entity], tx);
  }

  async insertAll(entities: T[], tx: Transaction | null = null): Promise<void> {
    if (entities.length === 0) {
      return;
    }
    const entitiesSerialized = this.serialize(entities);
    const query = this.pool.insert(entitiesSerialized).into(this.tableName);
    await this.execQuery(query, tx);
  }

  async beginTransaction(isolationLevel: IsolationLevel = IsolationLevel.SERIALIZABLE): Promise<Transaction> {
    return this.pool.transaction({ isolationLevel: isolationLevel });
  }

  protected async execQuery(query: Knex.QueryBuilder, tx: Transaction | null = null): Promise<any> {
    if (tx === null) {
      return query;
    }
    return query.transacting(tx);
  }

}
