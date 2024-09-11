import { getUserInfo } from '@/actions/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { validateRequest } from '@/lib/lucia';

export default async function UserPage({ params }: { params: { name: string } }) {
  const userInfo = await getUserInfo(params.name)
  const { user } = await validateRequest();

  return (
    <div className={`p-4 mx-auto mt-8 flex flex-col w-full`}>
      { userInfo && (
        <div className={`flex flex-row items-center gap-4`}>
          <Avatar className={`w-16 h-16`}>
            <AvatarImage src={userInfo.profile_image_url || ''}/>
            <AvatarFallback>{userInfo.display_name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={`flex flex-col`}>
            <p className={`text-2xl`}>{userInfo.display_name}</p>
            {user && user.twitch_id === userInfo.twitch_id && (
              <span className={`text-sm italic`}>Your Channel</span>
            )}
          </div>
          
        </div>
      )}
    </div>
  )
}