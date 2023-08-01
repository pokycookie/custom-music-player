'use client'

import { useEffect, useState } from 'react'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'

interface IProps {
  children?: React.ReactNode
  aspectRatio: number
  showCount: number
  infinite?: boolean
}

export default function Carousel(props: IProps) {
  const [idx, setIdx] = useState(0)
  const [container, setContainer] = useState<React.ReactNode[][]>([])

  const indexHandler = (delta: number) => {
    let index
    if (props.infinite) {
      index = idx + delta
      if (index < 0) {
        index = container.length - 1
      } else if (index > container.length - 1) {
        index = 0
      }
    } else {
      index = Math.min(Math.max(idx + delta, 0), container.length - 1)
    }
    setIdx(index)
  }

  useEffect(() => {
    const children: React.ReactNode[] = Array.isArray(props.children)
      ? props.children
      : [props.children]
    const container: React.ReactNode[][] = []

    for (let i = 0; i < children.length; i += props.showCount) {
      const viewport: React.ReactNode[] = []
      for (let j = 0; j < props.showCount; j++) {
        const index = i + j
        if (index > children.length - 1) {
          viewport.push(<div></div>)
        } else {
          viewport.push(children[index])
        }
      }
      if (viewport.length > 0) container.push(viewport)
    }

    setContainer(container)
    setIdx(0)
  }, [props.children, props.showCount])

  return (
    <div className="w-full p-3 pl-9 pr-9">
      <div className="relative flex items-center grow">
        <div className="flex w-full overflow-hidden">
          {container.map((viewport, i) => {
            return (
              <motion.div
                key={i}
                animate={{ x: `-${100 * idx}%` }}
                transition={{ type: 'just' }}
                className="flex w-full shrink-0"
              >
                {viewport.map((node, i) => {
                  return (
                    <NodeWrapper
                      key={i}
                      showCount={props.showCount}
                      className="p-2 shrink-0 grow-0"
                    >
                      {node}
                    </NodeWrapper>
                  )
                })}
              </motion.div>
            )
          })}
        </div>
        {!props.infinite && idx != 0 ? (
          <button
            onClick={() => indexHandler(-1)}
            className="absolute w-12 h-12 text-gray-400 duration-200 bg-opacity-50 border rounded-full border-zinc-600 bg-zinc-900 hover:bg-opacity-100 -left-6 hover:scale-105"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        ) : null}
        {!props.infinite && idx != container.length - 1 ? (
          <button
            onClick={() => indexHandler(1)}
            className="absolute w-12 h-12 text-gray-400 duration-200 bg-opacity-50 border rounded-full border-zinc-600 bg-zinc-900 hover:bg-opacity-100 -right-6 hover:scale-105"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

const NodeWrapper = styled.div<Pick<IProps, 'showCount'>>((props) => ({
  width: `${100 / props.showCount}%`,
}))
