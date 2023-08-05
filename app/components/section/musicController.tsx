import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  fa0,
  fa2,
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faRepeat,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons'
import ArcInput from '../ui/arcInput'
import { numberToTimeString } from '@/utils/time'
import CD from '../ui/cd'
import { useCurrentPlaylistStore } from '@/store/CurrentPlaylist'

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

  const repeatHandler = () => {
    if (props.onRepeat) {
      let repeat = props.repeat + 1
      if (repeat > 2) repeat = 0
      props.onRepeat(repeat)
    }
  }

  const playHandler = () => {
    if (props.onPlay) props.onPlay()
    if (props.onPause) props.onPause()
  }

  const muteHandler = () => {
    if (!props.onMute) return
    if (props.mute) props.onMute(false)
    else props.onMute(true)
  }

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
          <div className="flex items-center justify-center w-[200px] pointer-events-none">
            <CD
              imgSrc={`https://i.ytimg.com/vi/${currentPlayMusic.videoID}/original.jpg`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-[200px] pointer-events-none">
            <CD imgSrc={null} />
          </div>
        )}
      </div>
      <div className="absolute w-[260px] h-[38px] flex justify-between items-center">
        <FontAwesomeIcon
          className="w-4 h-4 cursor-pointer text-zinc-400 hover:text-zinc-300"
          onClick={repeatHandler}
          icon={props.repeat === 0 ? fa0 : props.repeat === 1 ? faRepeat : fa2}
        />
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
