'use client'

import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface IProps {
  children?: React.ReactNode
  autoClose?: () => void
  className?: string
}

export default function Modal(props: IProps) {
  const [cantCloseAnimate, setCantCloseAnimate] = useState(false)

  const cantCloseHandler = () => {
    setCantCloseAnimate(true)
    setTimeout(() => {
      setCantCloseAnimate(false)
    }, 500)
  }

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as Element).id === 'modal--background'
    if (target) {
      if (props.autoClose) {
        props.autoClose()
      } else {
        cantCloseHandler()
      }
    }
  }

  const modalRoot = document.getElementById('modal--root')
  const modalArea = (
    <motion.div
      id="modal--background"
      className="absolute top-0 left-0 z-40 flex items-center justify-center h-screen overflow-hidden w-vw bg-white/10 backdrop-blur-sm"
      onClick={clickHandler}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={'z-50 w-auto h-auto ' + props.className}
        initial={{ y: 300 }}
        animate={{
          y: 0,
          x: cantCloseAnimate ? [-3, 3, -3, 3, -3, 3, 0] : 0,
        }}
        transition={{
          x: { duration: 0.5 },
          y: { type: 'spring', damping: 20, stiffness: 300 },
        }}
      >
        {props.children}
      </motion.div>
    </motion.div>
  )

  if (modalRoot) {
    return ReactDOM.createPortal(modalArea, modalRoot)
  } else {
    return <></>
  }
}
