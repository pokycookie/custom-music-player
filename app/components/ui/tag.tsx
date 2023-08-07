import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IProps {
  tagName: string
  onDelete?: (tagName: string) => void
}

export default function Tag(props: IProps) {
  const deleteHandler = () => {
    if (props.onDelete) props.onDelete(props.tagName)
  }

  return (
    <li className="flex items-center gap-1 p-1 pl-3 pr-3 text-sm border rounded-full border-zinc-600 text-zinc-500 bg-zinc-900">
      <p>#</p>
      <p>{props.tagName}</p>
      <FontAwesomeIcon
        icon={faXmark}
        onClick={deleteHandler}
        className="cursor-pointer text-zinc-600 hover:text-zinc-400"
      />
    </li>
  )
}
