import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch applications - let error boundary handle errors
  const applications = await prisma.jobApplication.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }).catch((error) => {
    console.error('Failed to fetch applications:', error)
    // Return empty array on error - dashboard will show empty state
    return []
  })

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'APPLIED').length,
    interviewing: applications.filter(app => app.status === 'INTERVIEWING').length,
    offers: applications.filter(app => app.status === 'OFFER').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
  }

  return (
    <DashboardClient 
      user={session.user}
      applications={JSON.parse(JSON.stringify(applications))}
      stats={stats}
    />
  )
}