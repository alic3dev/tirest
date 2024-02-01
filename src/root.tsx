import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'
import { inject } from '@vercel/analytics'

import { RouterHead } from './components/router-head/router-head'

import './global.css'

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  const hasInjected = useSignal<boolean>(false)

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    (): void => {
      if (!hasInjected.value) {
        inject()
        hasInjected.value = true
      }
    },
    { strategy: 'document-ready' },
  )

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  )
})
