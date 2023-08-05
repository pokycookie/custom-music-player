import { useCallback } from 'react'

interface IProps {
  startDeg: number
  endDeg: number
  size?: number
  holeSize?: number
  color?: string
  strokeWidth?: number
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  reverse?: boolean
}

/**
 * Must used in \<svg viewBox="0 0 200 200"></svg>
 */
export default function Arc(props: IProps) {
  const strokeWidth = props.strokeWidth ?? 0
  const outer = (props.size ?? 100) - strokeWidth
  const inner = (props.holeSize ?? 80) + strokeWidth

  const getPos = useCallback((deg: number, r: number) => {
    const radian = deg * (Math.PI / 180)

    const x = 100 + r * Math.sin(radian)
    const y = 100 - r * Math.cos(radian)

    return { x, y }
  }, [])

  const start = getPos(props.startDeg, outer)
  const end = getPos(props.endDeg, outer)

  const innerStart = getPos(props.startDeg, inner)
  const innerEnd = getPos(props.endDeg, inner)

  const startDeg = props.startDeg
  const endDeg = props.endDeg < startDeg ? props.endDeg + 360 : props.endDeg

  const largeArcFlag =
    endDeg - startDeg < 180 ? (props.reverse ? 1 : 0) : props.reverse ? 0 : 1
  const sweepFlag1 = props.reverse ? 0 : 1
  const sweepFlag2 = sweepFlag1 === 0 ? 1 : 0

  return (
    <path
      d={`M ${start.x} ${start.y} A ${outer} ${outer} 0 ${largeArcFlag} ${sweepFlag1} ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${inner} ${inner} 0 ${largeArcFlag} ${sweepFlag2} ${innerStart.x} ${innerStart.y} Z
          `}
      stroke="#2c3333"
      strokeWidth={strokeWidth}
      fill={props.color ?? 'black'}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    />
  )
}
