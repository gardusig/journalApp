import { AxiosInstance, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

import { createAxiosInstance } from "./client.util";

export interface AuthenticationClientInterface {
  getValidToken(): Promise<string | null>;
}

interface AuthenticationToken {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthenticationClientOptions {
  loginAPI: string;
  refreshTokenAPI: string;
}

const DefaultAuthenticationClientOptions: AuthenticationClientOptions = {
  loginAPI: "auth/login",
  refreshTokenAPI: "auth/refresh",
};

export class AuthenticationClient implements AuthenticationClientInterface {
  private readonly axiosInstance: AxiosInstance;
  private readonly userCredentials: UserCredentials;
  private readonly authenticationToken: AuthenticationToken;
  private readonly authenticationClientOptions: AuthenticationClientOptions;

  constructor(
    baseURL: string,
    userCredentials: UserCredentials,
    authenticationClientOptions: AuthenticationClientOptions = DefaultAuthenticationClientOptions,
    accessToken?: string,
    refreshToken?: string,
  ) {
    this.axiosInstance = createAxiosInstance(baseURL);
    this.userCredentials = userCredentials;
    this.authenticationClientOptions = authenticationClientOptions;
    this.authenticationToken = {
      accessToken: accessToken ?? null,
      refreshToken: refreshToken ?? null,
    };
  }

  public async getValidToken(): Promise<string | null> {
    if (this.isAuthenticationTokenValid()) {
      return this.authenticationToken.accessToken;
    }
    if (
      this.authenticationToken.refreshToken &&
      !isTokenExpired(this.authenticationToken.refreshToken)
    ) {
      await this.refreshAuthenticationToken();
    }
    if (this.isAuthenticationTokenValid()) {
      return this.authenticationToken.accessToken;
    }
    await this.createAuthenticationToken();
    if (this.isAuthenticationTokenValid()) {
      return this.authenticationToken.accessToken;
    }
    return null;
  }

  private isAuthenticationTokenValid(): boolean {
    if (!this.authenticationToken.accessToken) {
      return false;
    }
    return !isTokenExpired(this.authenticationToken.accessToken);
  }

  private async createAuthenticationToken(): Promise<void> {
    try {
      const response: AxiosResponse<{
        access_token: string;
        refresh_token: string;
      }> = await this.axiosInstance.post(
        this.authenticationClientOptions.loginAPI,
        {
          email: this.userCredentials.email,
          password: this.userCredentials.password,
        },
      );
      this.authenticationToken.accessToken = response.data.access_token;
      this.authenticationToken.refreshToken = response.data.refresh_token;
    } catch (error) {
      console.error("Failed to create new authentication token:", error);
    }
  }

  private async refreshAuthenticationToken(): Promise<void> {
    try {
      const response: AxiosResponse<{ access_token: string }> =
        await this.axiosInstance.post(
          this.authenticationClientOptions.refreshTokenAPI,
          {
            refresh_token: this.authenticationToken.refreshToken,
          },
        );
      if (response.data.access_token) {
        this.authenticationToken.accessToken = response.data.access_token;
      }
    } catch (error) {
      console.error("Failed to refresh access token:", error);
    }
  }
}

function isTokenExpired(token: string): boolean {
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
