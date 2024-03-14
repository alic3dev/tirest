import type { RequestHandler } from '@builder.io/qwik-city'
import type { Session } from '@auth/core/types'

import { createKysely } from '@vercel/postgres-kysely'

export const onPost: RequestHandler = async ({
  next,
  sharedMap,
  json,
  error,
  request,
  clientConn,
}): Promise<void> => {
  const session: Session & { uuid: string | undefined } =
    sharedMap.get('session')

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!session || !session.uuid) {
    throw error(401, 'Please login first.')
  }

  // TODO: Ratelimit this

  await next()

  const req = await request.json()

  if (
    !req.game_id ||
    typeof req.game_id !== 'string' ||
    typeof req.level !== 'number' ||
    typeof req.score !== 'number'
  ) {
    throw error(400, 'Invalid parameters.')
  }

  console.log(req)

  const db = createKysely<Database.Alic3Dev>()
  try {
    await db
      .insertInto('tirest_scores')
      .values({
        user_uuid: session.uuid,
        game_id: req.game_id,
        level: req.level,
        score: req.score,
        client_ip: clientConn.ip ?? '127.0.0.1',
      })
      .executeTakeFirstOrThrow()
  } catch {
    throw error(500, 'Failed to save score.')
  } finally {
    db.destroy()
  }

  json(200, { success: true })
}
