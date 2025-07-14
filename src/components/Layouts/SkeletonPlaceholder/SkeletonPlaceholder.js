import React from 'react'
import { useLoadingWithDelay } from '@/hooks/useLoadingWithDelay'
import './SkeletonPlaceholder.module.css' 

export function SkeletonPlaceholder({
  isLoading,
  width = '100%',
  height = '1rem',
  className = '',
  delay = 400,
  children
}) {
  const showSkeleton = useLoadingWithDelay(isLoading, delay)

  if (showSkeleton) {
    return (
      <div
        className={`skeleton-placeholder ${className}`}
        style={{ width, height }}
      />
    )
  }

  return children
}
