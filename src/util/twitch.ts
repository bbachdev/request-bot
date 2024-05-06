import { cookies } from 'next/headers';
import { validateRequest } from './auth_validate';
import { TwitchTokens } from "arctic";
import { twitch } from "@/util/auth";

export const TWITCH_ACCESS_TOKEN_NAME = 't_access_token';
export const TWITCH_REFRESH_TOKEN_NAME = 't_refresh_token';
export const TWITCH_ACCESS_TOKEN_EXPIRES = 't_expires';

interface TwitchAccessVariables {
  accessToken: string;
  storedState: string;
}

async function getTwitchAccessVariables() : Promise<TwitchAccessVariables | null> {
  //TODO: Refresh if needed
  const { session } = await validateRequest();
  console.log("Session:",session);
  if(!session) {
    return null;
  }
  console.log("Get cookies");
  const cookieStore = cookies()
  console.log("Cookie Store:",cookieStore);
  const storedState = cookieStore.get("twitch_oauth_state")?.value;
  let accessToken = cookieStore.get(TWITCH_ACCESS_TOKEN_NAME)?.value;
  const refreshToken = cookieStore.get(TWITCH_REFRESH_TOKEN_NAME)?.value;
  console.log("Access Token:",accessToken);
  console.log("Stored State:",storedState);
  if(!accessToken || !storedState) {
    console.log("Refresh token: ",refreshToken);
    //Get new access token
    if(!refreshToken) {
      return null;
    }
    let newTokens: TwitchTokens = await refreshAccessToken(refreshToken);
    let newStoredState = storedState || ""
    return { accessToken: newTokens.accessToken, storedState: newStoredState };
  }

  return { accessToken, storedState };
}

async function refreshAccessToken(refreshToken: string) : Promise<TwitchTokens> {
  const tokens: TwitchTokens = await twitch.refreshAccessToken(refreshToken);
  console.log("Tokens: ",tokens);

  const cookieStore = cookies()
  cookieStore.set(TWITCH_ACCESS_TOKEN_NAME, tokens.accessToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 10, path: "/" });
  cookieStore.set(TWITCH_REFRESH_TOKEN_NAME, tokens.refreshToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 10, path: "/" });
  cookieStore.set(TWITCH_ACCESS_TOKEN_EXPIRES, tokens.accessTokenExpiresAt.toISOString(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  return tokens;
}


export async function getTwitchUserInfo(username: string) {
  console.log("getTwitchUserInfo");
  try{
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
    console.log(userRes);
    return userRes.data[0]
  }catch(error){
    console.log(error);
    return null
  }
}