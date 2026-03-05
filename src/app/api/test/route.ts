import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic connection
    const userCount = await prisma.user.count()
    
    // Test if ApplicationTemplate table exists
    const templateCount = await prisma.applicationTemplate.count()
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection works!',
      users: userCount,
      templates: templateCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Test API Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message,
      code: error.code,
      details: error.toString()
    }, { status: 500 })
  }
}