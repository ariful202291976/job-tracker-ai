'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <CardTitle>Something went wrong!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}