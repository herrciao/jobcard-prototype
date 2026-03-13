import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { supabaseAdmin } from './supabase'

const ADMIN_EMAIL = 'info@elixirfab.com'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.id || !user.email) return true
      try {
        const db = supabaseAdmin()
        const { error } = await db.from('profiles').upsert(
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
        if (error) {
          console.error('[signIn] profile upsert failed:', error.message, error.details, error.code)
        }

        await db
          .from('team_members')
          .update({ member_id: user.id })
          .eq('member_email', user.email.toLowerCase())
          .is('member_id', null)
      } catch (e) {
        console.error('[signIn] unexpected error:', e)
      }
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
