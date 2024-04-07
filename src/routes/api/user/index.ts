import type { RequestHandler } from '@builder.io/qwik-city'
import type { Session } from '@auth/core/types'

import { createKysely } from '@vercel/postgres-kysely'
import { updateLeaderboardCacheDisplayName } from '~/utils/server/scores'

export const onPost: RequestHandler = async ({
  next,
  sharedMap,
  json,
  error,
  request,
  // clientConn,
}): Promise<void> => {
  const session: Session & { uuid: string | undefined } =
    sharedMap.get('session')

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!session || !session.uuid) {
    throw error(401, 'Please login first.')
  }

  // TODO: Ratelimit this

  await next()

  const req: { display_name: string | undefined } = await request.json()

  if (!req.display_name || typeof req.display_name !== 'string') {
    throw error(400, 'Invalid parameters.')
  }

  if (req.display_name.length > 100) {
    throw error(400, 'Display name too long.')
  }

  const db = createKysely<Database.Alic3Dev>()
  try {
    await db
      .updateTable('tirest_users')
      .set({
        display_name: req.display_name,
      })
      .where('uuid', '=', session.uuid)
      .executeTakeFirst()
  } catch {
    throw error(500, 'Failed to update display name.')
  } finally {
    db.destroy()
  }

  await updateLeaderboardCacheDisplayName(session.uuid, req.display_name)

  json(200, { success: true })
}