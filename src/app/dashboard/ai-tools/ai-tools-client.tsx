'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import Link from 'next/link'

type ActiveTool = 'resume' | 'cover-letter' | 'interview'

export default function AIToolsClient() {
  const [activeTool, setActiveTool] = useState<ActiveTool | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  // Shared form fields
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [tone, setTone] = useState('professional')

  const resetForm = () => {
    setCompany('')
    setPosition('')
    setJobDescription('')
    setResume('')
    setTone('professional')
    setResult('')
  }

  const handleResumeOptimize = async () => {
    setIsLoading(true)
    setResult('')
    try {
      const response = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, company, position }),
      })

      if (!response.ok) throw new Error('Failed to optimize resume')

      const data = await response.json()
      setResult(data.result)
      toast.success('Resume optimized successfully!')
    } catch (error) {
      toast.error('Failed to optimize resume', {
        description: 'Please check your input and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoverLetter = async () => {
    setIsLoading(true)
    setResult('')
    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, company, position, tone }),
      })

      if (!response.ok) throw new Error('Failed to generate cover letter')

      const data = await response.json()
      setResult(data.result)
      toast.success('Cover letter generated!')
    } catch (error) {
      toast.error('Failed to generate cover letter', {
        description: 'Please check your input and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterviewPrep = async () => {
    setIsLoading(true)
    setResult('')
    try {
      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, position, jobDescription }),
      })

      if (!response.ok) throw new Error('Failed to generate interview prep')

      const data = await response.json()
      setResult(data.result)
      toast.success('Interview prep generated!')
    } catch (error) {
      toast.error('Failed to generate interview prep', {
        description: 'Please check your input and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Tool selection screen
  if (!activeTool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Tools</h1>
                <p className="text-gray-600 mt-1">Powered by AI to help you land your dream job</p>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resume Optimizer Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTool('resume')}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Resume Optimizer</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Tailor your resume for any job description. Get keyword suggestions and improvement tips.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Optimize Resume
                </Button>
              </CardContent>
            </Card>

            {/* Cover Letter Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTool('cover-letter')}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Cover Letter Generator</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Generate personalized cover letters tailored to each company and role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Cover Letter
                </Button>
              </CardContent>
            </Card>

            {/* Interview Prep Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTool('interview')}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Interview Prep</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Get customized interview questions and tips based on company and role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Prepare for Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // Active tool screen
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => { setActiveTool(null); resetForm() }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to AI Tools
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTool === 'resume' && '🤖 Resume Optimizer'}
                {activeTool === 'cover-letter' && '✍️ Cover Letter Generator'}
                {activeTool === 'interview' && '💡 Interview Prep'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Google, Meta, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Software Engineer, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Description *</Label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resume input (for resume and cover letter tools) */}
            {(activeTool === 'resume' || activeTool === 'cover-letter') && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Paste your resume text *</Label>
                    <Textarea
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      placeholder="Paste your resume content here..."
                      rows={8}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tone selector (cover letter only) */}
            {activeTool === 'cover-letter' && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter Tone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              className="w-full"
              onClick={() => {
                if (activeTool === 'resume') handleResumeOptimize()
                if (activeTool === 'cover-letter') handleCoverLetter()
                if (activeTool === 'interview') handleInterviewPrep()
              }}
              disabled={isLoading || !company || !position || !jobDescription || ((activeTool === 'resume' || activeTool === 'cover-letter') && !resume)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {activeTool === 'resume' && 'Optimize Resume'}
                  {activeTool === 'cover-letter' && 'Generate Cover Letter'}
                  {activeTool === 'interview' && 'Generate Interview Prep'}
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>AI Result</CardTitle>
                  {result && (
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500">AI is generating your result...</p>
                  </div>
                ) : result ? (
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                    {result}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center">
                      Fill in the details on the left and click generate to see the AI result here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}