import NextAuth from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"

async function refreshTwitchAccessToken(token : any) {
  try{
    const reqUrl = 'https://id.twitch.tv/oauth2/token?'+
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: ''+token.refreshToken,
      client_id: ''+process.env.TWITCH_CLIENT_ID,
      client_secret: ''+process.env.TWITCH_CLIENT_SECRET,
    })

    const response = await fetch(reqUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  }catch(e){
    console.log(e)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }

}

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
    async jwt({ token, account = {}, user, profile } : any) {
      if (account && user) {
        if(account.access_token){
          token.accessToken = account.access_token
        }
        if(account.refresh_token){
          token.refreshToken = account.refresh_token
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() > token.exp) {
        return token
      }

      // Access token has expired, try to update it
      let refreshedTokens = await refreshTwitchAccessToken(token)
      return refreshedTokens
    }
  }
}

export default NextAuth(authOptions)