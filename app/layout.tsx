import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Player from './components/layout/player'
import Sidebar from './components/layout/sidebar'
import MusicDND from './components/ui/musicDND'
import ContextMenu from './components/ui/contextMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cookie Music Player',
  description: 'Web music player for youtube, soundcloud',
}

interface IProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en">
      <body className={inter.className + ' flex h-screen w-vw'}>
        <Sidebar />
        <main className="hidden min-w-0 overflow-auto grow shrink basis-full bg-zinc-700 md:block">
          {children}
        </main>
        <Player />
        <div id="modal--root"></div>
        <MusicDND />
        <ContextMenu />
      </body>
    </html>
  )
}
