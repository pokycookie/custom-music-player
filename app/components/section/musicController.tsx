import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons'
import ArcInput from '../ui/arcInput'
import { numberToTimeString } from '@/utils/time'
import CD from '../ui/cd'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'

import RepeatIcon from '@public/icon/repeat.svg'
import RepeatNoIcon from '@public/icon/repeatNo.svg'
import RepeatOneIcon from '@public/icon/repeatOne.svg'
import { useMemo } from 'react'

interface IProps {
  currentTime: number
  maxTime: number
  volume: number
  mute: boolean
  repeat: number
  isPlaying: boolean
  onCurrentTime?: (sec: number) => void
  onPlay?: () => void
  onPause?: () => void
  onPrev?: () => void
  onNext?: () => void
  onVolume?: (volume: number) => void
  onMute?: (mute: boolean) => void
  onRepeat?: (repeat: number) => void
}

export default function MusicController(props: IProps) {
  const currentPlayMusic = useCurrentPlaylistStore(
    (state) => state.currentPlayMusic
  )

  const onCurrentTime = (ratio: number) => {
    if (props.onCurrentTime) props.onCurrentTime(ratio * props.maxTime)
  }

  const onVolume = (ratio: number) => {
    if (props.onVolume) props.onVolume(ratio * 100)
    if (props.onMute) {
      if (ratio < 0.01) props.onMute(true)
      else props.onMute(false)
    }
  }

  const playHandler = () => {
    if (props.onPlay && !props.isPlaying) props.onPlay()
    if (props.onPause && props.isPlaying) props.onPause()
  }

  const muteHandler = () => {
    if (!props.onMute) return
    if (props.mute) props.onMute(false)
    else props.onMute(true)
  }

  const repeatIcon = useMemo(() => {
    const repeatHandler = () => {
      if (props.onRepeat) {
        let repeat = props.repeat + 1
        if (repeat > 2) repeat = 0
        props.onRepeat(repeat)
      }
    }

    switch (props.repeat) {
      case 0:
        return (
          <RepeatNoIcon
            width={16}
            height={16}
            onClick={repeatHandler}
            className="cursor-pointer fill-zinc-400 hover:fill-zinc-300"
          />
        )
      case 1:
        return (
          <RepeatIcon
            width={16}
            height={16}
            onClick={repeatHandler}
            className="cursor-pointer fill-zinc-400 hover:fill-zinc-300"
          />
        )
      case 2:
        return (
          <RepeatOneIcon
            width={16}
            height={16}
            onClick={repeatHandler}
            className="cursor-pointer fill-zinc-400 hover:fill-zinc-300"
          />
        )
      default:
        return <></>
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.repeat, props.onRepeat])

  return (
    <div className="relative flex items-center justify-center w-[305px] aspect-square">
      <svg viewBox="0 0 200 200" className="absolute">
        <ArcInput
          onChange={onCurrentTime}
          startDeg={260}
          endDeg={100}
          value={
            props.maxTime > 0 ? (props.currentTime / props.maxTime) * 100 : 0
          }
          color="#c084fc"
          bgColor="#3f3f46"
          reverse
          limit
        />
        <ArcInput
          onChange={onVolume}
          startDeg={280}
          endDeg={80}
          value={props.mute ? 0 : props.volume}
          color="#c084fc"
          bgColor="#3f3f46"
        />
      </svg>
      <div className="flex items-center justify-center w-full">
        {currentPlayMusic ? (
          <motion.div
            animate={props.isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={
              props.isPlaying
                ? { duration: 10, ease: 'linear', repeat: Infinity }
                : { duration: 0.1 }
            }
            className="flex items-center justify-center w-[200px] pointer-events-none"
          >
            <CD
              imgSrc={`https://i.ytimg.com/vi/${currentPlayMusic.videoID}/original.jpg`}
            />
          </motion.div>
        ) : (
          <div className="flex items-center justify-center w-[200px] pointer-events-none">
            <CD imgSrc={null} />
          </div>
        )}
      </div>
      <div className="absolute w-[260px] h-[38px] flex justify-between items-center">
        {repeatIcon}
        <FontAwesomeIcon
          className="w-5 h-5 p-2 text-white duration-200 rounded-full opacity-0 cursor-pointer hover:opacity-100 hover:bg-black/70"
          onClick={props.onPrev}
          icon={faBackwardStep}
        />
        <FontAwesomeIcon
          className="w-6 h-6 cursor-pointer text-zinc-300 hover:text-white"
          onClick={playHandler}
          icon={props.isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className="w-5 h-5 p-2 text-white duration-200 rounded-full opacity-0 cursor-pointer hover:opacity-100 hover:bg-black/70"
          onClick={props.onNext}
          icon={faForwardStep}
        />
        <FontAwesomeIcon
          className="w-4 h-4 cursor-pointer text-zinc-400 hover:text-zinc-300"
          onClick={muteHandler}
          icon={props.mute ? faVolumeXmark : faVolumeLow}
        />
      </div>
      {currentPlayMusic ? (
        <div>{/* <Heart id={props.music.videoID} /> */}</div>
      ) : null}
      <span className="absolute flex items-center justify-center w-full gap-1 mt-2 text-xs bottom-1">
        <p className="text-zinc-300">{numberToTimeString(props.currentTime)}</p>
        <p className="text-zinc-400">/</p>
        <p className="text-zinc-300">{numberToTimeString(props.maxTime)}</p>
      </span>
    </div>
  )
}
