import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IProps {
  close: () => void
  onSubmit?: () => void
  submitText?: string
  content?: string[]
}

export default function Caution(props: IProps) {
  return (
    <article className="flex flex-col justify-between w-full h-full p-4 rounded-md bg-zinc-800">
      <h2 className="flex items-center gap-2 mb-3 text-lg font-semibold text-zinc-300">
        <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5" />
        Caution
      </h2>
      <section className="flex flex-col gap-2 mb-6">
        {props.content?.map((text, i) => {
          return (
            <p className="text-zinc-400" key={i}>
              {text}
            </p>
          )
        })}
      </section>
      <section className="flex justify-end gap-2">
        <button
          className="p-2 pl-3 pr-3 text-sm text-gray-400 uppercase rounded bg-zinc-900 hover:bg-zinc-700"
          onClick={props.close}
        >
          cancel
        </button>
        <button
          className="p-2 pl-3 pr-3 text-sm uppercase border border-transparent rounded text-zinc-400 hover:text-zinc-300 bg-zinc-900 hover:bg-red-600"
          onClick={props.onSubmit}
        >
          {props.submitText ?? 'OK'}
        </button>
      </section>
    </article>
  )
}
