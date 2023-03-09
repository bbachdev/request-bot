import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's provider id (e.g. Twitch Id). */
      id: string,
      name?: string,
      picture?: string,
      email?: string
    }
  }
}