import { AbstractApiClient } from "../../shared/client/client.abstract";
import { CreateUserRequest, UpdateUserRequest } from "../dto/user.request.dto";
import { UserListResponse, UserResponse } from "../dto/user.response.dto";

export class UserServiceClient extends AbstractApiClient<
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserListResponse
> {
  constructor(baseUrl: string) {
    super(baseUrl, "user");
  }
}
