'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faHeadphones,
  faMusic,
  faGear,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import useModal from '@/hooks/useModal'
import AddMusic from '../modal/addMusic'

export default function Sidebar() {
  const [pageIdx, setPageIdx] = useState(0)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const pathname = usePathname()

  const { modal, openModal, closeModal, setContent } = useModal({
    autoClose: false,
    className: 'w-2/3 h-fit max-w-lg',
  })

  useEffect(() => {
    setContent(<AddMusic close={closeModal} />)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPageIdx(() => {
      const idx = navList.findIndex((e) => e.regex.test(pathname))
      if (idx > -1) return idx
      return 0
    })
  }, [pathname])

  return (
    <nav className="flex flex-col justify-between w-56 h-full shrink-0 bg-zinc-800">
      <div>
        <h1></h1>
        <ul className="relative">
          <motion.div
            className="absolute w-1 bg-purple-500 h-14"
            animate={{ y: 56 * (hoverIdx ?? pageIdx) }}
          ></motion.div>
          {navList.map((e, i) => {
            return (
              <li
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <Link
                  href={e.href}
                  className="flex items-center gap-4 p-4 pl-5 text-gray-200 h-14"
                >
                  <FontAwesomeIcon icon={e.icon} />
                  <p>{e.title}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="w-full p-3">
        <button
          className="flex items-center justify-center w-full gap-3 p-3 font-semibold text-gray-200 rounded bg-zinc-600 hover:bg-zinc-500"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faMusic} />
          <p>노래 추가</p>
        </button>
      </div>
      {modal}
    </nav>
  )
}

const navList = [
  {
    title: '홈',
    icon: faHouse,
    href: '/',
    regex: /^\/$/,
  },
  {
    title: '라이브러리',
    icon: faHeadphones,
    href: '/library',
    regex: /^\/library$/,
  },
  {
    title: '설정',
    icon: faGear,
    href: '/setting',
    regex: /^\/setting$/,
  },
]
