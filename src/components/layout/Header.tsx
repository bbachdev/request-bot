import { validateRequest } from '@/lib/lucia';
import { Button } from '../ui/button';
import { signOut } from '@/actions/auth';

export default async function Header() {
  const { user } = await validateRequest();

  return (
    <header className={`flex p-4 shadow-lg`}>
      <div>
        Header
      </div>
      { user && (
        <div>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      )}
    </header>
  )
}