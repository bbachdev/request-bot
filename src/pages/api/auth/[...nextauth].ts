import NextAuth from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, account = {}, profile } : any) {
      if(account.provider && !token[account.provider]){
        token[account.provider] = {}
      }
      if(account.access_token){
        token[account.provider].accessToken = account.access_token
      }
      if(account.refresh_token){
        token[account.provider].refreshToken = account.refresh_token
      }
      return token
    }
  }
}

export default NextAuth(authOptions)