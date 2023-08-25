import Image from 'next/image'
import { useState } from 'react'

interface IProps {
  src: string
  width: number
  height: number
  alt?: string
  className?: string
  fallback?: string
  draggable?: boolean
}

export default function ImageWithFallback(props: IProps) {
  const [src, setSrc] = useState(props.src)

  return (
    <Image
      src={src}
      width={props.width}
      height={props.height}
      className={props.className}
      alt={props.alt ?? ''}
      onError={() => setSrc(props.fallback ?? '')}
      draggable={props.draggable ?? true}
    />
  )
}
