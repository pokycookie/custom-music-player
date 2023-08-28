'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faHeadphones,
  faGear,
  faRecordVinyl,
  faMagnifyingGlass,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import useModal from '@/hooks/useModal'
import AddMusic from '../modal/addMusic'
import styled from '@emotion/styled'

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
    <nav className="flex flex-col justify-between h-full transition-all w-14 xl:w-56 shrink-0 bg-zinc-800">
      <ul className="relative">
        <motion.div
          className="absolute w-1 bg-purple-400 h-14"
          animate={{ y: 56 * (hoverIdx ?? pageIdx) }}
        ></motion.div>
        {navList.map((e, i) => {
          return (
            <List
              key={i}
              selected={pageIdx === i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <Link
                href={e.href}
                className="flex items-center gap-4 p-4 pl-5 h-14"
              >
                <FontAwesomeIcon icon={e.icon} className="w-4" />
                <p className="invisible overflow-hidden xl:visible whitespace-nowrap">
                  {e.title}
                </p>
              </Link>
            </List>
          )
        })}
      </ul>
      <div className="w-full p-2 xl:p-3">
        <button
          className="flex items-center justify-center w-full gap-3 p-3 text-gray-200 rounded bg-zinc-600 hover:bg-zinc-500"
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faPlus} className="w-4" />
          <p className="hidden overflow-hidden xl:block whitespace-nowrap">
            Add Music
          </p>
        </button>
      </div>
      {modal}
    </nav>
  )
}

const List = styled.li<{ selected: boolean }>((props) => ({
  color: props.selected ? '#c084fc' : '#e4e4e7',
}))

const navList = [
  {
    title: 'Home',
    icon: faHouse,
    href: '/',
    regex: /^\/$/,
  },
  {
    title: 'Search',
    icon: faMagnifyingGlass,
    href: '/search',
    regex: /^\/search$/,
  },
  {
    title: 'Playlist',
    icon: faHeadphones,
    href: '/playlist',
    regex: /^\/playlist.*$/,
  },
  // {
  //   title: 'Management',
  //   icon: faRecordVinyl,
  //   href: '/management',
  //   regex: /^\/management$/,
  // },
  {
    title: 'Settings',
    icon: faGear,
    href: '/setting',
    regex: /^\/setting$/,
  },
]
