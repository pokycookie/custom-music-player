import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal from '@/components/ui/modal'

interface IModalOptions {
  autoClose?: boolean
  className?: string
}

export default function useModal(options?: IModalOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(null)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const modal = (
    <AnimatePresence>
      {isOpen ? (
        <Modal
          autoClose={options?.autoClose ? closeModal : undefined}
          className={options?.className}
        >
          {content}
        </Modal>
      ) : null}
    </AnimatePresence>
  )

  return { openModal, closeModal, modal, isOpen, setContent }
}
