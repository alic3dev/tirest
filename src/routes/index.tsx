import type { JSXOutput } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

import { component$ } from '@builder.io/qwik'

import { Hero } from '~/components/starter/hero/hero'

export default component$((): JSXOutput => {
  return <Hero />
})

export const head: DocumentHead = {
  title: 'Tirest',
  meta: [
    {
      name: 'description',
      content: 'Tired.. Tirest.. Tertis.. Tet.. ris?',
    },
  ],
}
