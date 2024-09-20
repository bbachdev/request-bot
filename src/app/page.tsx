import SignInWithTwitch from '@/components/SignInWithTwitch';
import { validateRequest } from '@/lib/lucia';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { user } = await validateRequest();
  if(user){
    redirect(`/t/${user.display_name}`)
  }
  
  return (
    <div className={`flex-grow flex items-center justify-center`}>
      <SignInWithTwitch/>
    </div>
  );
}