import type { QwikAuthConfig } from '@builder.io/qwik-auth'
import { serverAuth$ } from '@builder.io/qwik-auth'

// import GitHub from '@auth/core/providers/github'
import Apple from '@auth/core/providers/apple'
import Google from '@auth/core/providers/google'

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(
    ({ env }): QwikAuthConfig => ({
      secret: env.get('AUTH_SECRET'),
      trustHost: true,
      providers: [
        Apple({
          clientSecret: env.get('APPLE_CLIENT_SECRET')!,
        }),
        Google({
          clientId: env.get('GOOGLE_CLIENT_ID'),
          clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
        }),
        // GitHub({
        //   clientId: env.get('GITHUB_ID')!,
        //   clientSecret: env.get('GITHUB_SECRET')!,
        // }),
      ],
    }),
  )
