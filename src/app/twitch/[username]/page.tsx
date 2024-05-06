import QueueTable from '@/components/tables/QueueTable';
import { validateRequest } from '@/util/auth_validate';
import { getTwitchUserInfo } from '@/util/twitch';
import { QueueItem, queueColumns } from '@/util/columns';
import { getChannelInfo } from '@/actions/channel';
import { redirect } from 'next/navigation'
import ChannelCreate from '@/components/channel/ChannelCreate';

//Get user data
//Get queue data (if exists)

export default async function Queue({ params }: { params: { username: string } }) {
  const { user } = await validateRequest();
  if(!user) {
    redirect('/')
  }

  const userInfo = await getTwitchUserInfo(params.username);

  const channelInfo = await getChannelInfo(user!.id);

  //TODO: Get queue data
  const queueData: QueueItem[] = [];

  return (
    <main className="flex min-h-screen flex-col px-24 py-12 bg-gray-900">
      {userInfo &&
        <>
          <div className="flex flex-row space-x-4 items-center">
            <div>
              <img src={userInfo.profile_image_url} className="w-12 h-12 rounded-full" />
            </div>
            <div className={`flex flex-col`}>
              <h1 className="text-3xl font-bold">{userInfo.display_name}</h1>
              { userInfo.id === user?.twitchId &&
                <div className="flex flex-row items-center">
                  <span className="text-sm italic">Your Channel</span>
                </div>
              }
            </div>
          </div>
          { channelInfo &&
            <QueueTable columns={queueColumns} data={queueData} />
          }
          { !channelInfo &&
            <ChannelCreate user={user!} userInfo={userInfo} />
          }
        </>
      }
    </main>
  );
}