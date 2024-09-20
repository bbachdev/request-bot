'use client'
import { signInTwitch } from '@/actions/auth';
import { Button } from './ui/button';
import { FaTwitch } from "react-icons/fa6";

export default function SignInWithTwitch() {
  return (
    <Button className={`bg-[#9146ff] hover:bg-[#9146ff]/90 gap-2`} onClick={() => signInTwitch()}><FaTwitch size={20}/>Sign In with Twitch</Button>
  )
}
