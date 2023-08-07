'use client'

import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import MusicController from '../section/musicController'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle } from '@fortawesome/free-solid-svg-icons'
import useAllCheck from '@/hooks/useAllCheck'
import Check from '../ui/check'
import CurrentPlaylist from '../section/currentPlaylist'
import useDisableContextMenu from '@/hooks/useDisableContextMenu'
import { AnimatePresence } from 'framer-motion'
import CheckController from '../ui/checkController'

export default function Player() {
  const [currentTime, setCurrentTime] = useState(0) // unit: sec
  const [maxTime, setMaxTime] = useState(0) // unit: sec
  const [volume, setVolume] = useState(100) // 0 ~ 100
  const [isMute, setIsMute] = useState(false)
  const [repeat, setRepeat] = useState(1) // 0: no repeat, 1: repeat all music, 2: repeat current music
  const [isPlaying, setIsPlaying] = useState(false)

  const { allCheck, allCheckHandler, checkHandler, checks, clearChecks } =
    useAllCheck()

  const playerREF = useRef<ReactPlayer>(null)
  const cps = useCurrentPlaylistStore()

  const currentPlayIdx = useMemo(() => {
    if (!cps.currentPlayMusic) return null

    const key = cps.currentPlayMusic.key
    const idx = cps.currentPlaylist.findIndex((e) => e.key === key)

    return idx
  }, [cps.currentPlayMusic, cps.currentPlaylist])

  // Public handler

  const changeMusic = (idx: number) => {
    if (cps.currentPlaylist.length === 0) return
    const tmpMusic = cps.currentPlaylist[idx]
    cps.setCurrentPlayMusic(null)
    setTimeout(() => {
      cps.setCurrentPlayMusic(tmpMusic)
    }, 100)
    setIsPlaying(true)
  }

  const replayMusic = () => {
    if (!playerREF.current) return
    if (!cps.currentPlayMusic) return
    const startTime = cps.currentPlayMusic.startTime ?? 0

    playerREF.current.seekTo(startTime)
  }

  const stopMusic = () => {
    setCurrentTime(0)
    setMaxTime(0)
    setIsPlaying(false)
    cps.setCurrentPlayMusic(null)
  }

  // Player callbacks

  const onReady = () => {
    if (!playerREF.current) return

    const startTime = cps.currentPlayMusic?.startTime ?? 0
    const endTime =
      cps.currentPlayMusic?.endTime ?? playerREF.current.getDuration()

    setMaxTime(endTime - startTime)
  }

  const onPlay = () => {
    setIsPlaying(true)
  }

  const onPause = () => {
    setIsPlaying(false)
  }

  const onEnded = () => {
    switch (repeat) {
      case 0:
        // no repeat
        if (currentPlayIdx === cps.currentPlaylist.length - 1) stopMusic()
        else nextHandler()
        break
      case 1:
        // repeat all music
        nextHandler()
        break
      case 2:
        // repeat current music
        replayMusic()
        break
      default:
        nextHandler()
        break
    }
  }

  const onBuffer = () => {}

  const onBufferEnd = () => {}

  const onProgress = () => {
    if (!playerREF.current) return
    if (!cps.currentPlayMusic) return
    const tmpCurrentTime =
      playerREF.current.getCurrentTime() - (cps.currentPlayMusic.startTime ?? 0)
    const floorTime = Math.floor(tmpCurrentTime)

    if (currentTime !== floorTime) setCurrentTime(floorTime)
  }

  // Music controller handler

  const playHandler = () => {
    setIsPlaying(true)
  }

  const pauseHandler = () => {
    setIsPlaying(false)
  }

  const prevHandler = () => {
    const lastIdx = cps.currentPlaylist.length - 1

    let prevIdx = (currentPlayIdx ?? 2) - 1
    if (prevIdx < 0) prevIdx = lastIdx
    else if (prevIdx > lastIdx) prevIdx = 0

    changeMusic(prevIdx)
  }

  const nextHandler = () => {
    const lastIdx = cps.currentPlaylist.length - 1

    let nextIdx = (currentPlayIdx ?? 0) + 1
    if (nextIdx < 0) nextIdx = lastIdx
    else if (nextIdx > lastIdx) nextIdx = 0

    changeMusic(nextIdx)
  }

  const volumeHandler = (volume: number) => {
    setVolume(volume)
  }

  const muteHandler = (mute: boolean) => {
    setIsMute(mute)
  }

  const currentTimeHandler = (sec: number) => {
    if (!playerREF.current) return

    const startTime = cps.currentPlayMusic?.startTime ?? 0
    playerREF.current.seekTo(startTime + sec)
    setCurrentTime(sec)
  }

  const repeatHandler = (repeat: number) => {
    setRepeat(repeat)
  }

  const deleteHandler = () => {
    if (currentPlayIdx === null) return

    if (checks.has(currentPlayIdx)) {
      let nextIdx = currentPlayIdx
      while (checks.has(nextIdx)) nextIdx++
      if (nextIdx < cps.currentPlaylist.length) changeMusic(nextIdx)
      else stopMusic()
    }

    cps.del(checks)
    clearChecks()
  }

  const shuffleHandler = () => {
    if (currentPlayIdx === null) return
    cps.shuffle(currentPlayIdx)
  }

  // Use Effect

  // Restart playlist
  useEffect(() => {
    setCurrentTime(0)
    setMaxTime(0)
    changeMusic(0)
    clearChecks()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cps.restartFlag])

  // Disable context menu
  useDisableContextMenu()

  return (
    <section className="flex flex-col items-center h-full select-none w-80 bg-zinc-800 shrink-0">
      <section className="flex items-center justify-center w-full shrink-0">
        {cps.currentPlayMusic ? (
          <div className="hidden">
            <ReactPlayer
              ref={playerREF}
              key={cps.currentPlayMusic.videoID}
              url={`https://www.youtube.com/watch?v=${cps.currentPlayMusic.videoID}`}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    start: cps.currentPlayMusic.startTime || 0,
                    end: cps.currentPlayMusic.endTime || null,
                  },
                },
              }}
              controls={false}
              playing={isPlaying}
              volume={volume / 100}
              muted={isMute}
              progressInterval={10}
              onReady={onReady}
              onPlay={onPlay}
              onPause={onPause}
              onEnded={onEnded}
              onProgress={onProgress}
              onBuffer={onBuffer}
              onBufferEnd={onBufferEnd}
            />
          </div>
        ) : null}
        <MusicController
          currentTime={currentTime}
          maxTime={maxTime}
          volume={volume}
          mute={isMute}
          repeat={repeat}
          isPlaying={isPlaying}
          onCurrentTime={currentTimeHandler}
          onPlay={playHandler}
          onPause={pauseHandler}
          onPrev={prevHandler}
          onNext={nextHandler}
          onVolume={volumeHandler}
          onMute={muteHandler}
          onRepeat={repeatHandler}
        />
      </section>
      <div className="w-full">
        <div className="relative grid items-center h-10 gap-3 ml-3 mr-3 border-b sw-full text-zinc-400 border-zinc-400 grid-cols-playlist">
          <Check
            checked={allCheck}
            onChange={(checked) =>
              allCheckHandler(checked, cps.currentPlaylist.length)
            }
          />
          <p className="text-sm">Title</p>
          <p className="text-sm">Artist</p>
          <FontAwesomeIcon
            icon={faShuffle}
            onClick={shuffleHandler}
            className="absolute w-4 cursor-pointer right-1 hover:text-zinc-300"
          />
        </div>
      </div>
      <CurrentPlaylist
        checks={checks}
        checkHandler={checkHandler}
        currentPlayIdx={currentPlayIdx}
        changeMusic={changeMusic}
        clearChecks={clearChecks}
      />
      <AnimatePresence>
        {checks.size > 0 ? (
          <CheckController onDelete={deleteHandler} count={checks.size} />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
