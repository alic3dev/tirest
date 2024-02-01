import { server$ } from '@builder.io/qwik-city'

export const fal = server$(({ a }: { a: number }): void => {
  console.log(a)
})
