import { component$, useSignal } from '@builder.io/qwik'
import styles from './header.module.css'
import { LoginModal } from '~/components/modals/loginModal'
import { useAuthSession, useAuthSignout } from '~/routes/plugin@auth'

export default component$(() => {
  const showLoginModal = useSignal<boolean>(false)
  const showRegisterModal = useSignal<boolean>(false)

  const session = useAuthSession()
  const signOut = useAuthSignout()

  return (
    <header class={styles.header}>
      <div class={['container', styles.wrapper]}>
        <h3>Tirest</h3>
        <ul>
          <li>Leaderboards</li>

          {session.value ? (
            <li>
              <a
                href="/signout"
                preventdefault:click
                onClick$={(): void => {
                  signOut.submit({ callbackUrl: window.location.toString() })
                }}
              >
                Sign out
              </a>
            </li>
          ) : (
            <>
              <li>
                <a
                  href="/signin"
                  preventdefault:click
                  onClick$={(): void => {
                    showLoginModal.value = true
                  }}
                >
                  Sign in
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  preventdefault:click
                  onClick$={(): void => {
                    showRegisterModal.value = true
                  }}
                >
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </div>

      <LoginModal showModal={showLoginModal} />
      <LoginModal showModal={showRegisterModal} registering />
    </header>
  )
})
