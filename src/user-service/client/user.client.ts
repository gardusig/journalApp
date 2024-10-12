import { AbstractApiClient } from "../../shared/client/client.abstract";
import { UserDto } from "../../user-service/dto/user.dto";

export class UserServiceClient extends AbstractApiClient<UserDto> {
  constructor(baseUrl: string) {
    super(baseUrl, "user");
  }
}
