import { sleep } from "@nestjs/terminus/dist/utils";
import axios, { AxiosResponse } from "axios";

export interface AuthenticationToken {
  accessToken: string;
  refreshToken: string;
}

export async function getValidToken(
  authenticationToken: AuthenticationToken | null,
): Promise<AuthenticationToken | null> {
  if (authenticationToken && !isTokenExpired(authenticationToken.accessToken)) {
    return authenticationToken;
  }
  if (!authenticationToken) {
    for (let retryCount = 0; retryCount < 3; retryCount++) {
      authenticationToken = await createAuthenticationToken();
      if (authenticationToken) {
        break;
      }
      sleep((1 << retryCount) * 1000);
    }
  }
  if (!authenticationToken) {
    return null;
  }
  for (let retryCount = 0; retryCount < 3; retryCount++) {
    const newToken = await refreshAccessToken(authenticationToken.refreshToken);
    if (newToken) {
      authenticationToken.accessToken = newToken;
      break;
    }
    sleep((1 << retryCount) * 1000);
  }
  return authenticationToken;
}

function isTokenExpired(accessToken: string): boolean {
  const payloadBase64 = accessToken.split(".")[1];
  const decodedPayload = JSON.parse(atob(payloadBase64));
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedPayload.exp < currentTime;
}

async function createAuthenticationToken(): Promise<AuthenticationToken | null> {
  try {
    const response: AxiosResponse<{
      access_token: string;
      refresh_token: string;
    }> = await axios.post("/auth/create-token", {
      // any necessary payload
    });
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  } catch (error) {
    console.error("Failed to create new authentication token:", error);
    return null;
  }
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const response: AxiosResponse<{ access_token: string }> = await axios.post(
      "/auth/refresh",
      {
        refresh_token: refreshToken,
      },
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}
