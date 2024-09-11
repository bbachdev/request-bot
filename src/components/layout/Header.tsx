import { validateRequest } from '@/lib/lucia';
import UserBadge from '../UserBadge';

export default async function Header() {
  const { user } = await validateRequest();
  console.log("User: ", user)

  return (
    <header className={`flex p-4 shadow-lg items-center`}>
      <div>
        Header
      </div>
      { user && (
        <div className={`ml-auto`}>
          <UserBadge user={user}/>
        </div>    
      )}
    </header>
  )
}