import { useCallback, useMemo, useRef } from 'react'
import Arc from './arc'

interface IProps {
  startDeg: number
  endDeg: number
  value: number
  reverse?: boolean
  limit?: boolean
  color?: string
  bgColor?: string
  onChange?: (ratio: number) => void
}

/**
 * Must used in \<svg viewBox="0 0 200 200"></svg>
 */
export default function ArcInput(props: IProps) {
  const RBarREF = useRef<SVGGElement>(null)

  // let diff = 0
  // if (props.reverse) {
  //   if (props.endDeg > props.startDeg) {
  //     diff = props.startDeg + 360 - props.endDeg
  //   } else {
  //     diff = props.startDeg - props.endDeg
  //   }
  // } else {
  //   if (props.endDeg > props.startDeg) {
  //     diff = props.endDeg - props.startDeg
  //   } else {
  //     diff = props.endDeg + 360 - props.startDeg
  //   }
  // }

  const diff =
    (props.reverse
      ? props.startDeg - props.endDeg + 360
      : props.endDeg - props.startDeg + 360) % 360

  const ratio = diff / 100
  const value = props.reverse
    ? props.startDeg - Math.max(Math.min(props.value, 100), 0) * ratio
    : props.startDeg + Math.max(Math.min(props.value, 100), 0) * ratio

  const pos = useMemo(() => {
    const r = 81

    const radian = value * (Math.PI / 180)
    const x = 100 + r * Math.sin(radian)
    const y = 100 - r * Math.cos(radian)

    return { x, y }
  }, [value])

  const getRatioX = useCallback((x: number, deltaAngle: number) => {
    const radian = deltaAngle * (Math.PI / 180)
    const r = 0.5 / Math.cos(radian)
    const cx = 0.5
    const deg = Math.acos((cx - x) / r) / (Math.PI / 180)
    const maxDeg = 180 - deltaAngle * 2

    return (deg - deltaAngle) / maxDeg
  }, [])

  const changeHandler = (sec: number) => {
    if (props.onChange) props.onChange(sec)
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    const range = RBarREF.current
    if (!range) return
    const rect = range.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)

    if (props.limit && ratio === 1) {
      onMouseUp()
    } else {
      changeHandler(getRatioX(ratio, 10))
    }
  }

  const onMouseDown = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    const range = RBarREF.current
    if (!range) return
    const rect = range.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    changeHandler(getRatioX(ratio, 10))
  }

  return (
    <g onMouseDown={onMouseDown} cursor="pointer">
      <g ref={RBarREF}>
        <Arc
          startDeg={props.startDeg}
          endDeg={props.endDeg}
          size={82}
          color={props.bgColor ?? 'black'}
          reverse={props.reverse}
        />
        <Arc
          startDeg={props.startDeg}
          endDeg={value}
          size={82}
          color={props.color ?? 'grey'}
          reverse={props.reverse}
        />
      </g>
      <Arc
        startDeg={props.startDeg}
        endDeg={props.endDeg}
        size={90}
        holeSize={66}
        color="transparent"
        reverse={props.reverse}
      />
      <circle
        cursor="pointer"
        cx={pos.x}
        cy={pos.y}
        r={2}
        fill={props.color ?? 'grey'}
      ></circle>
    </g>
  )
}
