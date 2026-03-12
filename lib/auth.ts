import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { supabaseAdmin } from './supabase'

const ADMIN_EMAIL = 'info@elixirfab.com'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: 'JobCard <noreply@jobcard.app>',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.id || !user.email) return true
      const db = supabaseAdmin()
      await db.from('profiles').upsert(
        {
          id: user.id,
          email: user.email,
          name: user.name || null,
          image: user.image || null,
          role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: false }
      )
      return true
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
