import { useEffect, useRef } from 'react'

export default function useResize(callback: () => void) {
  useEffect(() => {
    callback()
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }, [callback])
}
