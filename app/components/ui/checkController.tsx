import { faHeadphones, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'

interface IProps {
  count: number
  onDelete?: () => void
  onPlaylist?: () => void
}

export default function CheckController(props: IProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="flex w-full h-16 gap-2 p-2 shrink-0"
    >
      <button
        className="flex items-center justify-center w-full h-full gap-2 p-3 rounded-md hover:bg-zinc-600 bg-zinc-700 text-zinc-400"
        onClick={props.onDelete}
      >
        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 cursor-pointer" />
        <span className="text-sm">Remove</span>
      </button>
      <button
        className="flex items-center justify-center w-full h-full gap-2 p-3 rounded-md hover:bg-zinc-600 bg-zinc-700 text-zinc-400"
        onClick={props.onPlaylist}
      >
        <FontAwesomeIcon
          icon={faHeadphones}
          className="w-4 h-4 cursor-pointer"
        />
        <span className="text-sm">Add to playlist</span>
      </button>
    </motion.div>
  )
}
