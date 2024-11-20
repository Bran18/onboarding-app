'use client';

import { Component, useEffect, useState, type ReactNode } from 'react';

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export function ErrorBoundary({ fallback, children }: Props) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Error caught by error boundary:', error)
      setHasError(true)
    }

    // Simulate error catching (you may need to adjust this for your use case)
    window.addEventListener('error', (event) => handleError(event.error))

    return () => {
      window.removeEventListener('error', (event) => handleError(event.error))
    }
  }, [])

  if (hasError) {
    return <>{fallback}</>
  }

  return <>{children}</>
}