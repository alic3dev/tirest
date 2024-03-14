import type { ColumnType, Generated } from 'kysely'

declare global {
  namespace Database.Table {
    interface Users {
      id: ColumnType<Generated<number>, never, never>
      uuid: string
      sub: string
      created_timestamp: ColumnType<Date, never, never>
    }
  }
}

export {}

// CREATE TABLE tirest_users (
//     id serial,
//     uuid uuid,
//     sub varchar(100),
//     submitted_timestamp timestamp default current_timestamp
// );
