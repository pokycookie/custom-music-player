import { useEffect } from 'react'

export default function useDisableContextMenu() {
  useEffect(() => {
    const preventContext = (e: MouseEvent) => {
      e.preventDefault()
    }
    window.addEventListener('contextmenu', preventContext)
    return () => window.removeEventListener('contextmenu', preventContext)
  }, [])
}
