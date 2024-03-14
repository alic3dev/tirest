import type { EnvGetter } from '@builder.io/qwik-city/middleware/request-handler'
import type { QwikAuthConfig } from '@builder.io/qwik-auth'
import type { JWT } from '@auth/core/jwt'
import type { Session } from '@auth/core/types'

import { serverAuth$ } from '@builder.io/qwik-auth'

// import GitHub from '@auth/core/providers/github'
import Apple from '@auth/core/providers/apple'
import Google from '@auth/core/providers/google'

import { createKysely } from '@vercel/postgres-kysely'
import { sql } from 'kysely'

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(
    ({ env }: { env: EnvGetter }): QwikAuthConfig => ({
      secret: env.get('AUTH_SECRET'),
      trustHost: true,
      providers: [
        Apple({
          clientSecret: env.get('APPLE_CLIENT_SECRET')!,
          allowDangerousEmailAccountLinking: true,
        }),
        Google({
          clientId: env.get('GOOGLE_CLIENT_ID'),
          clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
          allowDangerousEmailAccountLinking: true,
        }),
        // GitHub({
        //   clientId: env.get('GITHUB_ID')!,
        //   clientSecret: env.get('GITHUB_SECRET')!,
        // }),
      ],
      callbacks: {
        jwt: async ({
          token,
          trigger,
        }: {
          token: JWT
          trigger?: 'signIn' | 'signUp' | 'update'
        }): Promise<JWT> => {
          if (trigger === 'signIn') {
            const db = createKysely<Database.Alic3Dev>()

            let existingUser: { uuid: string } | undefined = await db
              .selectFrom('tirest_users')
              .select('uuid')
              .where('sub', '=', token.sub!)
              .executeTakeFirst()

            if (!existingUser?.uuid) {
              await db
                .insertInto('tirest_users')
                .values({
                  uuid: sql`uuid_generate_v4()`,
                  sub: token.sub!,
                })
                .execute()

              existingUser = await db
                .selectFrom('tirest_users')
                .select('uuid')
                .where('sub', '=', token.sub!)
                .executeTakeFirst()
            }

            token.uuid = existingUser?.uuid
          }

          return token
        },
        session: async ({
          session,
          token,
        }: {
          session: Session
          token: JWT
        }): Promise<Session & { uuid: string }> => {
          return {
            ...session,
            uuid: token.uuid as string,
          }
        },
      },
    }),
  )
