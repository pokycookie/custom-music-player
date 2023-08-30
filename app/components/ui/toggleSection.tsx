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
      <div className="flex items-center justify-between w-full p-2 mb-1 text-sm text-gray-400">
        <p className="select-none">{props.title}</p>
        <ToggleBtn on={props.open} onChange={props.onChange} />
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: props.open ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-1">{props.children}</div>
      </motion.div>
    </section>
  )
}
