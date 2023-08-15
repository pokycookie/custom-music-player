import styled from '@emotion/styled'

interface IProps {
  tagName: string
  selected: boolean
  onChange?: (tagName: string) => void
}

export default function ToggleTag(props: IProps) {
  const clickHandler = () => {
    if (props.onChange) props.onChange(props.tagName)
  }

  return (
    <Tag
      className="flex items-center gap-1 p-1 pl-3 pr-3 text-sm border rounded-full cursor-pointer select-none hover:border-zinc-500 border-zinc-600 hover:text-zinc-400 text-zinc-500 bg-zinc-900"
      onClick={clickHandler}
      selected={props.selected}
    >
      <p>#</p>
      <p>{props.tagName}</p>
    </Tag>
  )
}

const Tag = styled.li<{ selected: boolean }>((props) => ({
  borderColor: props.selected ? '#c084fc' : '#52525b',
  color: props.selected ? '#c084fc' : '#71717a',
  ':hover': {
    borderColor: props.selected ? '#a855f7' : '#71717a',
    color: props.selected ? '#a855f7' : '#a1a1aa',
  },
}))
