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

    const { resume, jobDescription, company, position } = await request.json()

    if (!resume || !jobDescription) {
      return new NextResponse('Resume and job description are required', { status: 400 })
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume optimizer and career coach. Your job is to analyze a resume and a job description, then provide specific, actionable suggestions to tailor the resume for that specific role.

Guidelines:
- Focus on matching keywords from the job description
- Suggest stronger action verbs
- Recommend quantifiable achievements to highlight
- Identify skill gaps and suggest how to address them
- Keep suggestions professional and realistic
- Format your response in clear sections`,
        },
        {
          role: 'user',
          content: `Please optimize my resume for this specific job:

Company: ${company}
Position: ${position}

Job Description:
${jobDescription}

My Current Resume:
${resume}

Please provide:
1. **Key Matching Skills** - Skills from my resume that match the job description
2. **Missing Keywords** - Important keywords from the job description that are missing from my resume
3. **Suggested Improvements** - Specific changes to make to my resume
4. **Recommended Highlights** - What to emphasize for this specific role
5. **ATS Tips** - Tips to pass Applicant Tracking Systems`,
        },
      ],
    })

    const content = response.choices[0]?.message?.content || ''

    return NextResponse.json({ result: content })
  } catch (error) {
    console.error('Error optimizing resume:', error)
    return new NextResponse('AI service error', { status: 500 })
  }
}