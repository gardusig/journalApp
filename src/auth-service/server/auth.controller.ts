import {
  AbstractController,
  ApiResponse,
} from "shared/server/api/abstract.controller";

import { AuthenticationService } from "./auth.service";
import { Body, Logger, UnauthorizedException } from "@nestjs/common";
import { UserCredentials } from "./auth.credentials.dto";

@AbstractController.ApplyDecoratorsController("auth")
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);
  private readonly authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  async login(@Body() userCredentials: UserCredentials): ApiResponse<UserDto> {
    const isPasswordValid =
      await this.authenticationService.isUserCredentialsValid(userCredentials);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
