import type { ScoreWithUser } from '~/types'

import { createKysely } from '@vercel/postgres-kysely'
import { InsertResult } from 'kysely'

import { errors as errorMessages } from '~/utils/messages'

let leaderboardCache: ScoreWithUser[] | undefined

export async function getLeaderboardCache(): Promise<{
  res?: ScoreWithUser[]
  err?: string
}> {
  if (leaderboardCache) return { res: leaderboardCache }

  let res: ScoreWithUser[] | undefined
  let err: string | undefined

  const db = createKysely<Database.Alic3Dev>()

  try {
    res = await db
      .selectFrom('tirest_scores')
      .innerJoin('tirest_users', 'tirest_users.uuid', 'tirest_scores.user_uuid')
      .select([
        'tirest_scores.game_id',
        'tirest_scores.level',
        'tirest_scores.score',
        'tirest_scores.submitted_timestamp',
        'tirest_users.display_name',
        'tirest_users.uuid',
      ])
      .orderBy('score desc')
      .limit(10)
      .execute()
  } catch (_err) {
    console.error(_err)

    err = errorMessages.default
  } finally {
    await db.destroy()
  }

  leaderboardCache = res

  return { res, err }
}

export async function updateLeaderboardCacheDisplayName(
  uuid: string,
  displayName: string,
) {
  const { res }: { res?: ScoreWithUser[] } = await getLeaderboardCache()

  if (
    !Array.isArray(res) ||
    !res.find(
      (scoreWithUser: ScoreWithUser): boolean => scoreWithUser.uuid === uuid,
    )
  ) {
    return
  }

  const cache: ScoreWithUser[] = res
    .splice(0)
    .map((scoreWithUser: ScoreWithUser): ScoreWithUser => {
      if (scoreWithUser.uuid === uuid) {
        scoreWithUser.display_name = displayName
      }

      return scoreWithUser
    })

  res.push(...cache)
}

async function updateLeaderboardCache(
  newScoreWithUser: ScoreWithUser,
): Promise<void> {
  const { res }: { res?: ScoreWithUser[] } = await getLeaderboardCache()

  if (
    !Array.isArray(res) ||
    res.find(
      (scoreWithUser: ScoreWithUser): boolean =>
        scoreWithUser.game_id === newScoreWithUser.game_id,
    )
  ) {
    return
  }

  const cache: ScoreWithUser[] = res.splice(0)

  if (
    cache.find(
      (scoreWithUser: ScoreWithUser): boolean =>
        scoreWithUser.score < newScoreWithUser.score,
    )
  ) {
    cache.push(newScoreWithUser)
  }

  res.push(
    ...cache
      .sort(
        (
          scoreWithUserA: ScoreWithUser,
          scoreWithUserB: ScoreWithUser,
        ): number => scoreWithUserB.score - scoreWithUserA.score,
      )
      .slice(0, 10),
  )
}

export async function saveScoreToDatabase({
  user_uuid,
  game_id,
  level,
  score,
  client_ip,
}: {
  user_uuid: string
  game_id: string
  level: number
  score: number
  client_ip: string
}): Promise<{ res?: InsertResult; err?: string }> {
  const db = createKysely<Database.Alic3Dev>()

  let res: InsertResult | undefined
  let err: string | undefined

  try {
    await db
      .insertInto('tirest_scores')
      .values({
        user_uuid,
        game_id,
        level,
        score,
        client_ip,
      })
      .executeTakeFirstOrThrow()
  } catch (_err) {
    console.error(_err)

    err = 'Failed to save score.'
  }

  try {
    const newScoreWithUser = await db
      .selectFrom('tirest_scores')
      .innerJoin('tirest_users', 'tirest_users.uuid', 'tirest_scores.user_uuid')
      .select([
        'tirest_scores.game_id',
        'tirest_scores.level',
        'tirest_scores.score',
        'tirest_scores.submitted_timestamp',
        'tirest_users.display_name',
        'tirest_users.uuid',
      ])
      .where('tirest_scores.game_id', '=', game_id)
      .limit(1)
      .execute()

    updateLeaderboardCache(newScoreWithUser[0])
  } catch (_err) {
    console.error(_err)
  }

  await db.destroy()

  return { res, err }
}
