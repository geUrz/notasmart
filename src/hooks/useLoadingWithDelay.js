import { useEffect, useState } from 'react'

export function useLoadingWithDelay(loading, minDelay = 300) {
  const [visibleLoading, setVisibleLoading] = useState(loading)

  useEffect(() => {
    let timer
    if (!loading) {
      timer = setTimeout(() => setVisibleLoading(false), minDelay)
    } else {
      setVisibleLoading(true)
    }

    return () => clearTimeout(timer)
  }, [loading, minDelay])

  return visibleLoading
}
