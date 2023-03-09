import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma && Object.keys(globalThis.prisma).length === 0 ? globalThis.prisma : new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client