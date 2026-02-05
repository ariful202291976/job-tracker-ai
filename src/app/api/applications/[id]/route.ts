import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single application
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params  // ← FIX: await params

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const application = await prisma.jobApplication.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!application) {
      return new NextResponse('Not found', { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// PUT - Update application
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params  // ← FIX: await params

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
      resumeUrl,
    } = body

    // Verify ownership
    const existingApp = await prisma.jobApplication.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!existingApp) {
      return new NextResponse('Not found', { status: 404 })
    }

    const application = await prisma.jobApplication.update({
      where: {
        id: id,
      },
      data: {
        company,
        position,
        location: location || null,
        jobUrl: jobUrl || null,
        salary: salary || null,
        status,
        source: source || null,
        notes: notes || null,
        resumeUrl: resumeUrl || null,
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error updating application:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// DELETE application
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params  // ← FIX: await params

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify ownership
    const existingApp = await prisma.jobApplication.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!existingApp) {
      return new NextResponse('Not found', { status: 404 })
    }

    await prisma.jobApplication.delete({
      where: {
        id: id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting application:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}