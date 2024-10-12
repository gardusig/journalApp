import { Body, Inject, Param } from "@nestjs/common";

import {
  AbstractController,
  ApiResponse,
} from "../../shared/server/api/abstract.controller";
import { AbstractService } from "../../shared/server/api/abstract.service";
import { UserDto } from "../dto/user.dto";
import { UserServiceToken } from "./user.service";

@AbstractController.ApplyDecoratorsController("user")
export class UserController extends AbstractController<UserDto> {
  constructor(@Inject(UserServiceToken) service: AbstractService<UserDto>) {
    super(service);
  }

  @AbstractController.ApplyDecoratorsGetById("user", UserDto)
  async findById(@Param("id") id: string): ApiResponse<UserDto | null> {
    return super.findById(id);
  }

  @AbstractController.ApplyDecoratorsGetAll(UserDto)
  async findAll(): ApiResponse<UserDto[]> {
    return super.findAll();
  }

  @AbstractController.ApplyDecoratorsCreate(UserDto)
  async create(@Body() entity: UserDto): ApiResponse<UserDto> {
    return super.create(entity);
  }

  @AbstractController.ApplyDecoratorsUpdate(UserDto)
  async update(
    @Param("id") id: string,
    @Body() entity: UserDto,
  ): ApiResponse<UserDto | null> {
    return super.update(id, entity);
  }

  @AbstractController.ApplyDecoratorsDelete(UserDto)
  async delete(@Param("id") id: string): ApiResponse<UserDto | null> {
    return super.delete(id);
  }
}
