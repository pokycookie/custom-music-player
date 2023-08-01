'use client'

import { FocusEvent, KeyboardEvent, forwardRef, useRef, useState } from 'react'

interface IProps {
  value: number
  max?: number
  onChange?: (value: number) => void
  next?: () => void
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void
}

export default forwardRef<HTMLInputElement, IProps>(function DoubleDigitInput(
  props,
  ref
) {
  const focusCnt = useRef(0)

  const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.nativeEvent.key

    const allowKey = new Set(['Backspace', 'Delete', 'Tab'])
    if (!(/^[0-9]$/.test(key) || allowKey.has(key))) {
      e.preventDefault()
      return
    }

    if (key === 'Backspace' || key === 'Delete') {
      if (props.onChange) props.onChange(0)
      focusCnt.current = 0
      return
    }

    const value = Number((String(props.value) + key).slice(-2))
    if (props.onChange && !Number.isNaN(value)) {
      if (props.max) props.onChange(Math.min(value, props.max))
      else props.onChange(value)
    }

    focusCnt.current += 1
    // 2번 이상 입력시 다음 input으로 focus이동
    if (props.next && focusCnt.current >= 2) props.next()
  }

  const focusHandler = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (props.onFocus) props.onFocus(e)
    focusCnt.current = 0
  }
  const blurHandler = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (props.onBlur) props.onBlur(e)
    focusCnt.current = 0
  }

  return (
    <input
      className="w-6 text-center bg-transparent outline-none"
      value={props.value.toString().padStart(2, '0')}
      onChange={() => {}}
      ref={ref}
      onKeyDown={keyDownHandler}
      onPaste={(e) => e.preventDefault()}
      onFocus={focusHandler}
      onBlur={blurHandler}
    />
  )
})
