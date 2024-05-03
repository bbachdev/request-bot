import { validateRequest } from '@/util/auth_validate';
import SignOutButton from '../auth/SignOutButton';

export default async function Header() {
  const { user } = await validateRequest();

  return (
    <header className={`flex items-center p-4 bg-gray-800`}>
      <div>
        <h1>Request Bot</h1>
      </div>
      { user &&
        <div className={`ml-auto`}>
          <SignOutButton />
        </div>
      }
    </header>
  )
}
