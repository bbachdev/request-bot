import { cookies } from 'next/headers';
import { validateRequest } from './auth_validate';

export const TWITCH_ACCESS_TOKEN_NAME = 't_access_token';
export const TWITCH_REFRESH_TOKEN_NAME = 't_refresh_token';

interface TwitchAccessVariables {
  accessToken: string;
  storedState: string;
}

async function getTwitchAccessVariables() : Promise<TwitchAccessVariables | null> {
  //TODO: Refresh if needed
  const { session } = await validateRequest();
  if(!session) {
    return null;
  }
  const cookieStore = cookies()
  const storedState = cookieStore.get("twitch_oauth_state")?.value;
  const accessToken = cookieStore.get(TWITCH_ACCESS_TOKEN_NAME)?.value;
  if(!accessToken || !storedState) {
    return null;
  }

  return { accessToken, storedState };
}


export async function getTwitchUserInfo(username: string) {
  const accessVariables = await getTwitchAccessVariables();
  if(!accessVariables) {
    return null;
  }
  const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
    headers: {
      Authorization: `Bearer ${accessVariables.accessToken}`,
      "Client-Id": process.env.TWITCH_API_CLIENT_ID!,
      "state": accessVariables.storedState
    }
  });
  const userRes = await response.json();

  return userRes.data[0]
}