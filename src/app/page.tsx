import { redirect } from "next/navigation";
import { validateRequest } from "@/util/auth_validate";
import { Button } from '@/components/ui/button';
import { createAuthUrl } from '@/actions/auth';
import SignInButton from '@/components/auth/SignInButton';

export default async function Home() {
  //Check if user is logged in
  const { user } = await validateRequest();
	if (user) {
		return redirect("/dashboard");
	}

  async function attemptLogin() {
    const res = await createAuthUrl();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignInButton />
    </main>
  );
}
