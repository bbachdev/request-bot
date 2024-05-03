'use client'
import { createAuthUrl } from '@/actions/auth';
import { Button } from '../ui/button';
import { FaTwitch } from "react-icons/fa6";

export default function SignInButton() {

  async function attemptLogin() {
    console.log("attemptLogin");
    await createAuthUrl();
  }
  
  return (
    <Button onClick={() => attemptLogin()} className={`bg-[#9146ff] text-white hover:bg-[#9146ff]/80 space-x-2 flex`}>
      <FaTwitch size={20}/><span>Log In with Twitch</span>
    </Button>
  )
}