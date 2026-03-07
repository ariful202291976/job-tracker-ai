import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Email and password are required')
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    })

    if (!user || !user?.password) {
      throw new Error('No account found with this email')
    }

    const isCorrectPassword = await bcrypt.compare(
      credentials.password,
      user.password
    )

    if (!isCorrectPassword) {
      throw new Error('Incorrect password')
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error: any) {
    console.error('Auth error:', error)
    
    // Return specific error messages
    if (error.message?.includes('timeout')) {
      throw new Error('Database connection timeout. Please try again.')
    }
    
    if (error.message?.includes('reach database')) {
      throw new Error('Cannot connect to database. Please try again later.')
    }
    
    // Re-throw original error if it's a user-facing message
    if (error.message?.includes('account') || error.message?.includes('password')) {
      throw error
    }
    
    throw new Error('Login failed. Please try again.')
  }
},
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}