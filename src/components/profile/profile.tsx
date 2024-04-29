import type { DefaultSession } from '@auth/core/types'
import type { JSXOutput } from '@builder.io/qwik'

import type { Score, ScoreError } from '~/types'

import { $, component$, useSignal } from '@builder.io/qwik'

import { ScoreTable } from '~/components/profile/score-table'

import styles from './profile.module.scss'

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
    const displayName = useSignal<string>(display_name)
    const displayNameInputRef = useSignal<HTMLInputElement>()

    const editingName = useSignal<boolean>(false)
    const submittingName = useSignal<boolean>(false)
    const submitError = useSignal<boolean>(false)

    const currentDate = useSignal<Date>((): Date => new Date())

    const submitNewName = $((): void => {
      if (!displayNameInputRef.value) return

      const newName: string = displayNameInputRef.value.value

      submittingName.value = true

      fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ display_name: newName }),
      })
        .then((res): void => {
          console.log(res)

          displayName.value = newName

          editingName.value = false
          submitError.value = false
        })
        .catch((err): void => {
          console.error(err)

          submitError.value = true
        })
        .finally((): void => {
          submittingName.value = false
        })
    })

    return (
      <div class={styles.profile}>
        <h2 class={styles.header}>Profile</h2>

        <div class={styles.content}>
          <div class={styles.section}>
            <div class={styles['display-name']}>Display Name</div>
            {editingName.value ? (
              <>
                <div class={styles['edit-display-name']}>
                  <input
                    type="text"
                    defaultValue={displayName.value}
                    disabled={submittingName.value}
                    ref={displayNameInputRef}
                  />
                  <button
                    onClick$={submitNewName}
                    disabled={submittingName.value}
                  >
                    Save
                  </button>
                </div>

                {submitError.value && (
                  <p>Something went wrong, try submitting again.</p>
                )}
              </>
            ) : (
              <h3 class={styles.title}>
                {displayName.value}

                <span
                  class={styles.edit}
                  onClick$={() => (editingName.value = true)}
                >
                  Edit
                  <span class="icon icon-pencil" title="Edit display name" />
                </span>
              </h3>
            )}

            <div class={styles['profile-image-wrapper']}>
              {user.image && <img src={user.image!} height={96} width={96} />}
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
