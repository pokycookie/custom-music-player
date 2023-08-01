'use client'

import styled from '@emotion/styled'
import { MouseEvent, useRef, useState } from 'react'
import DoubleDigitInput from './doubleDigitInput'
import { timeToNumber } from '@/utils/time'

interface IProps {
  unit?: string
  onChange?: (value: number) => void
}

export default function TimeInput(props: IProps) {
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)
  const [focus, setFocus] = useState(false)

  const hourREF = useRef<HTMLInputElement>(null)
  const minuteREF = useRef<HTMLInputElement>(null)
  const secondREF = useRef<HTMLInputElement>(null)

  const focusDivHandler = (e: MouseEvent<HTMLDivElement>) => {
    const isHourNode = e.target === hourREF.current
    const isMinuteNode = e.target === minuteREF.current
    const isSecondNode = e.target === secondREF.current
    if (!isHourNode && !isMinuteNode && !isSecondNode) {
      if (hourREF.current) hourREF.current.focus()
    }
  }

  const hourHandler = (value: number) => {
    setHour(value)
    if (props.onChange) props.onChange(timeToNumber(value, minute, second))
  }
  const minuteHandler = (value: number) => {
    setMinute(value)
    if (props.onChange) props.onChange(timeToNumber(hour, value, second))
  }
  const secondHandler = (value: number) => {
    setSecond(value)
    if (props.onChange) props.onChange(timeToNumber(hour, minute, value))
  }

  return (
    <FocusDiv
      focus={focus}
      onClick={focusDivHandler}
      className="flex justify-between w-full p-2 pl-3 pr-3 text-sm text-gray-400 border rounded-md border-zinc-600 bg-zinc-900"
    >
      {props.unit && (
        <span
          className="text-sm text-gray-400 select-none data-[focus=true]:text-purple-400"
          data-focus={focus}
        >
          {props.unit}
        </span>
      )}
      <div>
        <DoubleDigitInput
          ref={hourREF}
          value={hour}
          onChange={hourHandler}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          next={() => minuteREF.current?.focus()}
        />
        <span>:</span>
        <DoubleDigitInput
          ref={minuteREF}
          value={minute}
          max={59}
          onChange={minuteHandler}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          next={() => secondREF.current?.focus()}
        />
        <span>:</span>
        <DoubleDigitInput
          ref={secondREF}
          value={second}
          max={59}
          onChange={secondHandler}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
    </FocusDiv>
  )
}

const FocusDiv = styled.div<{ focus: boolean }>((props) => ({
  outline: props.focus ? 'solid 1px' : 'none',
  outlineColor: props.focus ? '#c084fc' : '#52525b',
}))
