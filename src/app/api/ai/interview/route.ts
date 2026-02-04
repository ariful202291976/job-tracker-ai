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

    const { company, position, jobDescription } = await request.json()

    if (!company || !position) {
      return new NextResponse('Company and position are required', { status: 400 })
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert interview coach with years of experience preparing candidates for technical and behavioral interviews. 
          
Guidelines:
- Provide relevant interview questions for the specific role
- Include both technical and behavioral questions
- Group questions by category
- Provide tips for answering each question
- Include company-specific advice where possible
- Be specific and actionable`,
        },
        {
          role: 'user',
          content: `Prepare me for an interview at:

Company: ${company}
Position: ${position}

${jobDescription ? `Job Description:\n${jobDescription}` : ''}

Please provide:
1. **Company Research Tips** - Key things to know about ${company}
2. **Technical Questions** - Likely technical questions for this role (5-7 questions)
3. **Behavioral Questions** - Common behavioral questions with STAR method tips (5 questions)
4. **Questions to Ask Them** - Smart questions to ask the interviewer (5 questions)
5. **Final Tips** - Last-minute preparation advice`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content || ''

    return NextResponse.json({ result: content })
  } catch (error) {
    console.error('Error generating interview prep:', error)
    return new NextResponse('AI service error', { status: 500 })
  }
}