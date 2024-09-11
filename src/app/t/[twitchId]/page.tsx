import { getTwitchUser } from '@/actions/twitch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { validateRequest } from '@/lib/lucia';
import { redirect } from 'next/navigation';

export default async function UserPage({ params }: { params: { twitchId: string } }) {
  console.log('User',params.twitchId)
  const { user } = await validateRequest();
  if(!user){
    redirect('/')
  }
  //TODO: Try to use useQuery for this
  const userInfo = await getTwitchUser(user!.id, params.twitchId)
  console.log('User Info: ', userInfo)

  return (
    <div>
      <div className={`flex flex-row items-center`}>
        <Avatar>
          <AvatarImage src={userInfo.profile_image_url}/>
          <AvatarFallback>{userInfo.display_name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className={`font-bold`}>{userInfo.display_name}</p>
      </div>
    </div>
  )
}