'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react'
import Link from 'next/link'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'

const STATUS_COLORS = {
  WISHLIST: '#9CA3AF',
  APPLIED: '#FCD34D',
  INTERVIEWING: '#60A5FA',
  OFFER: '#34D399',
  REJECTED: '#F87171',
  ACCEPTED: '#A78BFA',
  WITHDRAWN: '#D1D5DB',
}

export default function AnalyticsClient({ applications }: { applications: any[] }) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const total = applications.length
    const applied = applications.filter(app => app.status === 'APPLIED').length
    const interviewing = applications.filter(app => app.status === 'INTERVIEWING').length
    const offers = applications.filter(app => app.status === 'OFFER' || app.status === 'ACCEPTED').length
    const rejected = applications.filter(app => app.status === 'REJECTED').length

    // Success rate (offers / (offers + rejected))
    const successRate = offers + rejected > 0 
      ? ((offers / (offers + rejected)) * 100).toFixed(1)
      : '0.0'

    // Response rate (anything beyond APPLIED / total)
    const responded = applications.filter(app => 
      app.status !== 'APPLIED' && app.status !== 'WISHLIST'
    ).length
    const responseRate = total > 0 
      ? ((responded / total) * 100).toFixed(1)
      : '0.0'

    // Status distribution for pie chart
    const statusDistribution = Object.entries(
      applications.reduce((acc: any, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {})
    ).map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
    }))

    // Applications over time (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30)
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() })
    
    const applicationsOverTime = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const count = applications.filter(app => 
        format(new Date(app.appliedDate), 'yyyy-MM-dd') === dayStr
      ).length
      return {
        date: format(day, 'MMM dd'),
        count,
      }
    })

    // Top companies by application count
    const companyCounts = applications.reduce((acc: any, app) => {
      acc[app.company] = (acc[app.company] || 0) + 1
      return acc
    }, {})
    
    const topCompanies = Object.entries(companyCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({
        company,
        count,
      }))

    // Source breakdown
    const sourceCounts = applications.reduce((acc: any, app) => {
      const source = app.source || 'Other'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})
    
    const sourceBreakdown = Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count,
    }))

    return {
      total,
      applied,
      interviewing,
      offers,
      rejected,
      successRate,
      responseRate,
      statusDistribution,
      applicationsOverTime,
      topCompanies,
      sourceBreakdown,
    }
  }, [applications])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-1">Insights into your job search performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.responseRate}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.total - analytics.applied - applications.filter(a => a.status === 'WISHLIST').length} responses received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.offers} offers / {analytics.offers + analytics.rejected} final outcomes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.total > 0 ? ((analytics.interviewing / analytics.total) * 100).toFixed(1) : '0.0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.interviewing} interviews scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejection Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.total > 0 ? ((analytics.rejected / analytics.total) * 100).toFixed(1) : '0.0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.rejected} rejections
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Applications Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Applications Over Time</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.applicationsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Current application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Companies Applied</CardTitle>
              <CardDescription>Most applications sent</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topCompanies} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="company" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Source Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Application Sources</CardTitle>
              <CardDescription>Where you found these jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.sourceBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}