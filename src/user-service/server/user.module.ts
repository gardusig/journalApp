import { Module } from "@nestjs/common";
import { AbstractModule } from "shared/server/api/abstract.module";

import { UserController } from "./user.controller";
import { UserService, UserServiceToken } from "./user.service";

@Module({
  imports: [
    AbstractModule.configure({
      controller: UserController,
      service: UserService,
      serviceToken: UserServiceToken,
    }),
  ],
})
export class UserModule {}
