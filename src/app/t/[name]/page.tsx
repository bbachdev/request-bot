import { getUserInfo } from '@/actions/users';
import Queue from '@/components/library/Queue';
import { queueColumns } from '@/components/library/QueueColumns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { validateRequest } from '@/lib/lucia';

export default async function UserPage({ params }: { params: { name: string } }) {
  const userInfo = await getUserInfo(params.name)
  const { user } = await validateRequest();

  //TODO: TEMP DATA; REMOVE
  const data = [
    {
      id: '1',
      title: 'Song 1',
      artist: 'Artist 1',
      requested_by: 'Requested By 1',
      notes: 'Notes 1',
      position: 1,
      cover_image_url: 'https://picsum.photos/id/10/200/300'
    },
    {
      id: '2',
      title: 'Song 2',
      artist: 'Artist 2',
      requested_by: 'Requested By 2',
      notes: 'Notes 2',
      position: 2,
      cover_image_url: 'https://picsum.photos/id/10/200/300'
    },
    {
      id: '3',
      title: 'Song 3',
      artist: 'Artist 3',
      requested_by: 'Requested By 3',
      notes: 'Notes 3',
      position: 3,
      cover_image_url: 'https://picsum.photos/id/10/200/300'
    },
    {
      id: '4',
      title: 'Song 4',
      artist: 'Artist 4',
      requested_by: 'Requested By 4',
      notes: 'Notes 4',
      position: 4,
      cover_image_url: 'https://picsum.photos/id/10/200/300'
    },
    {
      id: '5',
      title: 'Song 5',
      artist: 'Artist 5',
      requested_by: 'Requested By 5',
      notes: 'Notes 5',
      position: 5,
      cover_image_url: 'https://picsum.photos/id/10/200/300'
    },
  ]

  return (
    <div className={`p-4 mx-auto mt-8 flex flex-col w-full gap-4`}>
      { userInfo && (
        <>
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
          <Queue columns={queueColumns} data={data}/>
        </>
      )}
    </div>
  )
}