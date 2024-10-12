import { Logger } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { isJWT } from "class-validator";
import * as jwt from "jsonwebtoken";

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
  protected readonly logger = new Logger(AuthenticationClient.name);

  private readonly axiosInstance: AxiosInstance;
  private readonly authenticationToken: AuthenticationToken;
  private readonly authenticationClientOptions: AuthenticationClientOptions;

  constructor(
    baseURL: string,
    authenticationClientOptions: AuthenticationClientOptions = DefaultAuthenticationClientOptions,
    accessToken?: string,
    refreshToken?: string,
  ) {
    this.axiosInstance = createAxiosInstance(baseURL);
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
    this.authenticationToken.accessToken = generateToken();
    this.authenticationToken.refreshToken = generateToken();
    console.debug("Created authentication token");
  }

  private async refreshAuthenticationToken(): Promise<void> {
    this.authenticationToken.accessToken = generateToken();
    console.debug("Refreshed authentication token");
  }
}

function isTokenExpired(token: string): boolean {
  console.debug("Validating token:", token);
  if (!isJWT(token)) {
    return false;
  }
  return true;
}

function generateToken(): string {
  return jwt.sign(
    {
      userId: "123456",
      username: "exampleUser",
    },
    "your_secret_key",
    {
      expiresIn: "5m",
    },
  );
}
