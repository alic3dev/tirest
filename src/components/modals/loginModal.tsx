import type { JSXOutput, Signal } from '@builder.io/qwik'
import { component$ } from '@builder.io/qwik'
import { Modal, ModalContent } from '@qwik-ui/headless'
import { Login } from '../auth/login'

import styles from './modal.module.scss'

export const LoginModal = component$<{
  showModal: Signal<boolean>
  registering?: boolean
}>(({ showModal, registering = false }): JSXOutput => {
  return (
    <Modal
      bind:show={showModal}
      class={`${styles['with-backdrop']} ${styles['wrapping-container']}`}
    >
      <ModalContent>
        <Login registering={registering} />
      </ModalContent>
    </Modal>
  )
})
