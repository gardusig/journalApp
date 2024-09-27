import { Body, Inject, Param } from "@nestjs/common";
import {
  AbstractController,
  ApiResponse,
} from "shared/api/abstract.controller";
import { AbstractService } from "shared/api/abstract.service";

import { UserDto } from "./user.dto";
import { UserServiceToken } from "./user.service";

@AbstractController.ApplyDecoratorsController(UserDto)
export class UserController extends AbstractController<UserDto> {
  constructor(@Inject(UserServiceToken) service: AbstractService<UserDto>) {
    super(service);
  }

  @AbstractController.ApplyAuthHeaders()
  @AbstractController.ApplyDecoratorsGetById(UserDto)
  async findById(@Param("id") id: string): ApiResponse<UserDto | null> {
    return super.findById(id);
  }

  @AbstractController.ApplyAuthHeaders()
  @AbstractController.ApplyDecoratorsGetAll(UserDto)
  async findAll(): ApiResponse<UserDto[]> {
    return super.findAll();
  }

  @AbstractController.ApplyAuthHeaders()
  @AbstractController.ApplyDecoratorsCreate(UserDto)
  async create(@Body() entity: UserDto): ApiResponse<UserDto> {
    return super.create(entity);
  }

  @AbstractController.ApplyAuthHeaders()
  @AbstractController.ApplyDecoratorsUpdate(UserDto)
  async update(
    @Param("id") id: string,
    @Body() entity: UserDto,
  ): ApiResponse<UserDto | null> {
    return super.update(id, entity);
  }

  @AbstractController.ApplyAuthHeaders()
  @AbstractController.ApplyDecoratorsDelete(UserDto)
  async delete(@Param("id") id: string): ApiResponse<UserDto | null> {
    return super.delete(id);
  }
}
