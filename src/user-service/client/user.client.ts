import { AbstractApiClient } from "shared/client/client.abstract";
import { UserDto } from "user-service/server/user.dto";

export class UserServiceClient extends AbstractApiClient<UserDto> {
  constructor() {
    super("http://localhost:3000/api", "user");
  }
}
