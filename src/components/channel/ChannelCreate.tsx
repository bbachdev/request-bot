'use client'
import { User } from 'lucia';
import { Button } from '../ui/button';

interface ChannelCreateProps {
  user: User;
  userInfo: any;
}

export default function ChannelCreate({ user, userInfo }: ChannelCreateProps) {

  function createChannel() {
    console.log("Run createChannel server action");
  }

  return (
    <div className="mx-auto mt-32 flex flex-col">
      { userInfo.id === user?.twitchId &&
        <div className={`flex flex-col space-y-4 items-center`}>
          <p>{`First time here? Add a song list to get started.`}</p>
          <Button className={`bg-[#9146ff] text-white hover:bg-[#9146ff]/80`} onClick={() => createChannel()}>Create Song List</Button>
        </div>
      }
      { userInfo.id !== user?.twitchId &&
        <div>
          <p>{`This user has not added a song list yet.`}</p>
        </div>
      }
    </div>
  )
}
