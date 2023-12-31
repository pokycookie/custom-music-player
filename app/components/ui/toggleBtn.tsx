'use client'

import { motion } from 'framer-motion'

interface IProps {
  on: boolean
  onChange?: () => void
}

export default function ToggleBtn(props: IProps) {
  const clickHandler = () => {
    if (props.onChange) props.onChange()
  }

  return (
    <motion.button
      className="flex relative items-center w-10 h-5 p-1 border rounded-full bg-zinc-900 data-[on=true]:justify-end justify-start"
      data-on={props.on}
      onClick={clickHandler}
      animate={{ borderColor: props.on ? '#c084fc' : '#3f3f46' }}
    >
      <motion.div className="absolute h-3 bg-purple-400 rounded-full aspect-square"></motion.div>
    </motion.button>
  )
}
