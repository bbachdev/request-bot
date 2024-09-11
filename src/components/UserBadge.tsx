'use client'
import { signOut } from '@/actions/auth'
import { Button } from './ui/button'
import type { User } from "lucia";

interface UserBadgeProps {
  user: User | null
}

export default function UserBadge( {user}: UserBadgeProps) {
  return (
    <>
      {user && (
        <div>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      )}
    </>
  )
}