'use client'

import { signOut } from '@/actions/auth';
import { Button } from '../ui/button'

export default function SignOutButton() {

  async function attemptSignOut() {
    await signOut();
  }

  return (
    <Button onClick={() => attemptSignOut()} className={`bg-[#9146ff] text-white hover:bg-[#9146ff]/80 space-x-2 flex`}>
      Sign Out
    </Button>
  )
}