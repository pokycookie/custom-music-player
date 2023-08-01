'use client'

import { motion } from 'framer-motion'
import ToggleBtn from './toggleBtn'

interface IProps {
  title: string
  open: boolean
  onChange?: () => void
  children?: React.ReactNode
}

export default function ToggleSection(props: IProps) {
  return (
    <section>
      <button
        className="flex items-center justify-between w-full p-2 text-sm text-gray-400"
        onClick={props.onChange}
      >
        <p>{props.title}</p>
        <ToggleBtn on={props.open} />
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: props.open ? 'auto' : 0 }}
        data-open={props.open}
        className="data-[open=false]:overflow-hidden"
      >
        {props.children}
      </motion.div>
    </section>
  )
}
