import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

interface AuthContainerProps {
  children: React.ReactNode
}

export default function AuthContainer({ children } : AuthContainerProps) {
  const router = useRouter()

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push('/api/auth/signin')
    },
  })
  
  return (
    <>
      <main>
        {children}
      </main>
    </>
  )
}