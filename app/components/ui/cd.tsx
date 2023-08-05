import Image from 'next/image'

interface IProps {
  imgSrc: string | null
  size?: number
  holeSize?: number
}

export default function CD(props: IProps) {
  const outer = props.size ?? 99
  const inner = props.holeSize ?? 25

  return (
    <>
      <svg viewBox="0 0 200 200" width="0" height="0">
        <defs>
          <clipPath id="cd">
            <path
              d={`M 100 100 m -${outer} 0 a ${outer} ${outer} 0 1 0 ${
                2 * outer
              } 0 a ${outer} ${outer} 0 1 0 -${
                2 * outer
              } 0 Z M 100 100 m -${inner} 0 a ${inner} ${inner} 0 0 1 ${
                2 * inner
              } 0 a ${inner} ${inner} 0 0 1 -${2 * inner} 0 Z`}
            />
          </clipPath>
        </defs>
      </svg>
      {props.imgSrc ? (
        <Image
          src={props.imgSrc}
          alt="CD"
          className="w-full aspect-square object-cover [clip-path:url(#cd)]"
          width={1200}
          height={1200}
        />
      ) : (
        <div className="w-full aspect-square bg-zinc-700 [clip-path:url(#cd)]"></div>
      )}
    </>
  )
}
