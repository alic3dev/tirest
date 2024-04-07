import type { DefaultSession } from '@auth/core/types'
import type { JSXOutput } from '@builder.io/qwik'

import type { Score, ScoreError } from '~/types'

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

import { ScoreTable } from '~/components/profile/ScoreTable'

import styles from '~/components/profile/Profile.module.scss'

export const Profile = component$(
  ({
    user,
    display_name,
    scores,
  }: {
    user: Partial<Required<DefaultSession>['user']>
    display_name: string
    scores: { lastTen: Score[] | ScoreError; topTen: Score[] | ScoreError }
  }): JSXOutput => {
    const previousDisplayName = useSignal<string>(display_name)
    const displayName = useSignal<string>(display_name)

    const currentDate = useSignal<Date>((): Date => new Date())

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track, cleanup }) => {
      track(displayName)

      let timeoutHandle: number

      const newName: string = displayName.value

      if (previousDisplayName.value !== newName) {
        previousDisplayName.value = newName

        timeoutHandle = window.setTimeout((): void => {
          console.log(
            fetch('/api/user', {
              method: 'POST',
              body: JSON.stringify({ display_name: newName }),
            })
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                console.error(err)
              }),
          )
        }, 2000)
      }

      cleanup(() => {
        window.clearTimeout(timeoutHandle)
      })
    })

    return (
      <div class={styles.profile}>
        <h2 class={styles.header}>Profile</h2>

        <div class={styles.content}>
          <div class={styles.section}>
            <h3 class={styles.title}>
              <span
                contentEditable="true"
                onInput$={(event) => {
                  const elem: HTMLSpanElement = event.target as HTMLSpanElement

                  displayName.value = elem.innerText
                }}
              >
                {display_name}
              </span>
              <span class="icon icon-pencil" title="Edit display name" />
            </h3>
            <div class={styles['profile-image-wrapper']}>
              {user.image && <img src={user.image} height={96} width={96} />}
            </div>
            <label>
              Name
              <input type="text" value={user.name} disabled />
            </label>
            <label>
              Email
              <input type="text" value={user.email} disabled />
            </label>
          </div>

          <div class={styles.section}>
            <ScoreTable
              title="Top 10 scores"
              scores={scores.topTen}
              currentDate={currentDate.value}
            />
            <ScoreTable
              title="Last 10 scores"
              scores={scores.lastTen}
              currentDate={currentDate.value}
            />
          </div>
        </div>
      </div>
    )
  },
)
