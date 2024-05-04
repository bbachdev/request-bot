import { validateRequest } from '@/util/auth_validate';
import { getTwitchUserInfo } from '@/util/twitch';
import { useRouter } from 'next/router'

//Get user data
//Get queue data (if exists)

export default async function Queue({ params }: { params: { username: string } }) {
  const { user } = await validateRequest();

  const userInfo = await getTwitchUserInfo(params.username);

  return (
    <main className="flex min-h-screen flex-col px-24 py-12 bg-gray-900">
      {userInfo &&
        <div className="flex flex-row space-x-4 items-center">
          <div>
            <img src={userInfo.profile_image_url} className="w-12 h-12 rounded-full" />
          </div>
          <div className={`flex flex-col`}>
            <h1 className="text-3xl font-bold">{userInfo.display_name}</h1>
            { userInfo.id === user?.twitchId &&
              <div className="flex flex-row items-center">
                <span className="text-sm italic">Your Queue</span>
              </div>
            }
          </div>
        </div>
      }
    </main>
  );
}