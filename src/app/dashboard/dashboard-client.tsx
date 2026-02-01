'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, LogOut, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react'
import AddJobDialog from '@/components/dashboard/add-job-dialog'
import ApplicationsTable from '@/components/dashboard/applications-table'

interface DashboardClientProps {
  user: {
    id: string
    email: string
    name?: string | null
  }
  applications: any[]
  stats: {
    total: number
    applied: number
    interviewing: number
    offers: number
    rejected: number
  }
}

export default function DashboardClient({ user, applications, stats }: DashboardClientProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Job Tracker AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user.name || user.email}</span>
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          {/* Applied */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applied}</div>
              <p className="text-xs text-muted-foreground">Waiting for response</p>
            </CardContent>
          </Card>

          {/* Interviewing */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviewing</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.interviewing}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          {/* Offers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offers</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.offers}</div>
              <p className="text-xs text-muted-foreground">Received</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Job Applications</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track all your job applications
                </p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ApplicationsTable applications={applications} />
          </CardContent>
        </Card>
      </main>

      {/* Add Job Dialog */}
      <AddJobDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  )
}