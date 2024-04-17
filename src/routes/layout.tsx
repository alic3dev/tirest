import type { Session } from '@auth/core/types'
import type { JSXOutput, Signal } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'

import { component$, Slot, useStyles$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import { useAuthSession } from '../routes/plugin@auth'

import Header from '../components/starter/header/header'
import Footer from '../components/starter/footer/footer'

import styles from './styles.scss?inline'

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  })
}

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: ':)',
  }
})

export default component$((): JSXOutput => {
  const session: Readonly<Signal<Session | null>> =
    useAuthSession() as Readonly<Signal<Session>>

  useStyles$(styles)
  return (
    <>
      <Header session={session.value || undefined} />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  )
})
