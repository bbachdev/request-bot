import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <nav className={'p-4 bg-gray-800 text-white'}>
      <ul className={'flex'}>
        <div className={'mr-auto'}>
          <li>
            <Link href={'/'}>Request Bot</Link>
          </li>
        </div>
        {status === 'authenticated' && 
          <div className={'ml-auto'}>
            <li>
              <button onClick={() => signOut()}>Sign Out</button>
            </li>
          </div>
        }
      </ul>
    </nav>
  )
}