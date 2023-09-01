'use client'

import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '@emotion/styled'

interface IProps {
  checked: boolean
  onChange?: (checked: boolean) => void
}

export default function Check(props: IProps) {
  const clickHandler = () => {
    if (props.onChange) props.onChange(!props.checked)
  }

  return (
    <button className="w-4 h-4 shrink-0">
      <CheckIcon
        className="w-4 h-4"
        checked={props.checked}
        icon={props.checked ? faSquareCheck : faSquare}
        onClick={clickHandler}
      />
    </button>
  )
}

const CheckIcon = styled(FontAwesomeIcon)<{ checked: boolean }>((props) => ({
  color: props.checked ? '#9333ea' : '#3f3f46',
  ':hover': {
    color: props.checked ? '#a855f7' : '#52525b',
  },
}))
