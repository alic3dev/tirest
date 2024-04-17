import type { ColumnType, Generated } from 'kysely'

declare global {
  namespace Database.Table {
    interface Scores {
      id: ColumnType<Generated<number>, never, never>
      user_uuid: string
      game_id: string
      level: number
      score: number

      client_ip: string | null
      submitted_timestamp: ColumnType<Date, never, never>
    }
  }
}

export {}

// CREATE TABLE tirest_scores (
//     id serial,
//     user_uuid uuid not null,
//     game_id varchar(36) not null,
//     level smallint not null,
//     score integer not null,
//     client_ip inet,
//     submitted_timestamp timestamp default current_timestamp
// );
