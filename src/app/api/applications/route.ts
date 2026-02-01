import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all applications for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// POST - Create new application
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const {
      company,
      position,
      location,
      jobUrl,
      salary,
      status,
      source,
      notes,
    } = body

    if (!company || !position) {
      return new NextResponse('Company and position are required', { status: 400 })
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        company,
        position,
        location: location || null,
        jobUrl: jobUrl || null,
        salary: salary || null,
        status: status || 'APPLIED',
        source: source || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error creating application:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}