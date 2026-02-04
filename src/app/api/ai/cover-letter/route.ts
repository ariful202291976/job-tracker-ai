import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import groq from '@/lib/groq'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { resume, jobDescription, company, position, tone } = await request.json()

    if (!jobDescription || !company || !position) {
      return new NextResponse('Job description, company, and position are required', { status: 400 })
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a professional cover letter writer. Write compelling, personalized cover letters that stand out. 
          
Guidelines:
- Make it specific to the company and role
- Show genuine interest in the company
- Highlight relevant experience and skills
- Keep it concise (3-4 paragraphs)
- Use a ${tone || 'professional'} tone
- Do not use generic phrases like "I am writing to express my interest"
- Do not use filler words
- Make it sound natural and authentic`,
        },
        {
          role: 'user',
          content: `Write a cover letter for the following:

Company: ${company}
Position: ${position}
Tone: ${tone || 'professional'}

Job Description:
${jobDescription}

${resume ? `My Resume:\n${resume}` : ''}

Write a compelling cover letter that will make me stand out.`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content || ''

    return NextResponse.json({ result: content })
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return new NextResponse('AI service error', { status: 500 })
  }
}