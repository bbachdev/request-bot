import AuthLayout from "@/components/AuthContainer"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { UserData } from "@/types/TwitchTypes";
import { getServerSession } from "next-auth/next"
import { getToken } from "next-auth/jwt";
import Image from "next/image";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";

export default function Channel({ channelInfo } : InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AuthLayout>
      {channelInfo.id && 
        <div className={'flex justify-center items-center text-3xl'}>
          <Image alt="Channel profile picture" src={channelInfo.profile_image_url} height={45} width={45} className={'rounded-full mr-4'}></Image> {channelInfo.display_name}
        </div>
      }
    </AuthLayout>
  )
}

//TODO: Begin connection to app db and retrieve songlist + queue
export const getServerSideProps: GetServerSideProps<{channelInfo : UserData}> = async ({query, req, res}) => {
  const session = await getServerSession(req, res, authOptions)
  console.log(session)

  const { channelName } = query;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if(session && token){
    console.log(token.accessToken)
    console.log(process.env.TWITCH_CLIENT_ID)
    const res = await fetch(`https://api.twitch.tv/helix/users?login=`+channelName, { method: 'GET', headers: {"Authorization" : 'Bearer '+token.accessToken, "Client-Id":''+process.env.TWITCH_CLIENT_ID}})
    const twitchRes : any = await res.json()
    console.log(twitchRes)
    const singleUser = twitchRes.data[0]
    let userData : UserData = {id: singleUser.id, login: singleUser.login, display_name: singleUser.display_name, broadcaster_type: singleUser.broadcaster_type, description: singleUser.description, profile_image_url: singleUser.profile_image_url}
    return {
      props:{
        channelInfo: userData
      }
    }
  }else{
    let nullUserData : UserData = {id: '', login: '', display_name: 'None', broadcaster_type: '', description: '', profile_image_url: ''}
    return {
      props:{
        channelInfo: nullUserData
      }
    }
  }
}