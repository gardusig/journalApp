import { Injectable, Logger } from "@nestjs/common";

import { UserCredentials } from "./auth.credentials.dto";
import { UserServiceClient } from "user-service/client/user.client";

export const AuthenticationServiceToken = "AuthenticationService";

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private readonly userServiceClient: UserServiceClient;

  constructor(userServiceClient: UserServiceClient) {
    this.userServiceClient = userServiceClient;
  }

  async isUserCredentialsValid(
    userCredentials: UserCredentials
  ): Promise<boolean> {
    const user = await this.userServiceClient.findById(userCredentials.email);
    if (!user) {
      return false;
    }
    return userCredentials.password == user.password;
  }
}
