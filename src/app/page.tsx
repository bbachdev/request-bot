import { redirect } from "next/navigation";
import { validateRequest } from "@/util/auth_validate";
import { createAuthUrl } from '@/actions/auth';
import SignInButton from '@/components/auth/SignInButton';

export default async function Home() {
  //Check if user is logged in
  const { user, session } = await validateRequest();

  return (
    <main className="flex flex-col items-center justify-between p-24">
      { user ? <span>Signed In</span> : <SignInButton /> }
    </main>
  );
}
