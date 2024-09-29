import {
  Get,
  Delete,
  Post,
  Put,
  Logger,
  applyDecorators,
  Controller,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from "@nestjs/swagger";
import { ApiHeader } from "@nestjs/swagger";

import { AbstractService } from "./abstract.service";

export interface ErrorResponse {
  message: string;
  statusCode: number;
}

export type ApiResponse<T> = Promise<T | ErrorResponse>;

export abstract class AbstractController<T> {
  protected readonly logger = new Logger(AbstractController.name);
  protected readonly service: AbstractService<T>;

  constructor(service: AbstractService<T>) {
    this.service = service;
  }

  protected async findById(id: string): ApiResponse<T | null> {
    return await this.service.findById(id);
  }

  protected async findAll(): ApiResponse<T[]> {
    return await this.service.findAll();
  }

  protected async create(entity: T): ApiResponse<T> {
    return await this.service.create(entity);
  }

  protected async update(id: string, entity: T): ApiResponse<T | null> {
    return await this.service.update(id, entity);
  }

  protected async delete(id: string): ApiResponse<T | null> {
    return await this.service.delete(id);
  }

  static ApplyDecoratorsDelete<T>(entity: new (...args: any[]) => T) {
    return applyDecorators(
      Delete(":id"),
      ApiOperation({ summary: `Delete a ${entity.name} by ID` }),
      ApiResponse({
        status: 200,
        description: `${entity.name} deleted successfully`,
        type: entity,
      }),
      ApiResponse({ status: 404, description: `${entity.name} not found` }),
      ApiParam({
        name: "id",
        type: String,
        description: `The ID of the ${entity.name} to delete`,
      }),
    );
  }

  static ApplyAuthHeaders() {
    return applyDecorators(
      ApiHeader({
        name: "username",
        description: "Username for authentication",
        required: true,
      }),
      ApiHeader({
        name: "password",
        description: "Password for authentication",
        required: true,
      }),
    );
  }

  static ApplyDecoratorsController<T>(entity: new (...args: any[]) => T) {
    return applyDecorators(ApiTags(entity.name), Controller(entity.name));
  }

  static ApplyDecoratorsGetById<T>(entity: new (...args: any[]) => T) {
    return applyDecorators(
      Get(":id"),
      ApiOperation({
        summary: `Retrieve a ${entity.name} by ID`,
      }),
      ApiResponse({
        status: 200,
        description: `The found ${entity.name}`,
        type: entity,
      }),
      ApiResponse({
        status: 404,
        description: `${entity.name} not found`,
      }),
    );
  }

  static ApplyDecoratorsGetAll<T>(entity: new (...args: any[]) => T) {
    return applyDecorators(
      Get(),
      ApiOperation({ summary: `Retrieve all ${entity.name}(s)` }),
      ApiResponse({
        status: 200,
        description: `List of ${entity.name}s`,
        type: [entity],
      }),
    );
  }

  static ApplyDecoratorsCreate<T>(entity: new (...args: any[]) => T) {
    return applyDecorators(
      Post(),
      ApiOperation({ summary: `Create a new ${entity.name}` }),
      ApiResponse({
        status: 201,
        description: `${entity.name} created successfully`,
        type: entity,
      }),
      ApiResponse({ status: 400, description: "Invalid input" }),
      ApiBody({
        description: `The ${entity.name} entity to create`,
        type: entity,
      }),
    );
  }

  static ApplyDecoratorsUpdate<T>(entity: new (...args: any[]) => T) {
    return applyDecorators(
      Put(":id"),
      ApiOperation({ summary: `Update an existing ${entity.name} by ID` }),
      ApiResponse({
        status: 200,
        description: `${entity.name} updated successfully`,
        type: entity,
      }),
      ApiResponse({ status: 404, description: `${entity.name} not found` }),
      ApiParam({
        name: "id",
        type: String,
        description: `The ID of the ${entity.name} to update`,
      }),
      ApiBody({
        type: entity,
        description: `The updated ${entity.name} entity`,
      }),
    );
  }
}
