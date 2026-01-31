import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          AI-Powered Job Application Tracker
        </h1>
        <p className="text-xl text-gray-600">
          Track your job applications, get AI-powered insights, and land your dream job faster.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}