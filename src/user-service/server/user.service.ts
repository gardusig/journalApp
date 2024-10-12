import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { AbstractService } from "shared/server/api/abstract.service";

import { UserDto } from "../dto/user.dto";

export const UserServiceToken = "UserService";

@Injectable()
export class UserService extends AbstractService<User> {
  constructor() {
    super(new PrismaClient().user, "id");
  }

  async findById(id: string): Promise<UserDto> {
    const existingRecord = await super.findBy("id", id);
    if (!existingRecord) {
      throw new NotFoundException(`Record with ID ${id} not found.`);
    }
    return existingRecord;
  }

  async findByEmail(email: string): Promise<UserDto> {
    const existingRecord = await super.findBy("email", email);
    if (!existingRecord) {
      throw new NotFoundException(`Record with email ${email} not found.`);
    }
    return existingRecord;
  }

  async findAll(): Promise<UserDto[]> {
    return super.findAll();
  }

  async create(entity: UserDto): Promise<UserDto> {
    const existingRecord = await this.findBy("id", entity.id);
    if (existingRecord) {
      throw new ConflictException(`Record with ID ${entity.id} already found.`);
    }
    return this.database.create(entity, entity.id);
  }

  async update(id: string, entity: UserDto): Promise<UserDto | null> {
    return super.update(id, entity);
  }

  async delete(id: string): Promise<UserDto | null> {
    return super.delete(id);
  }
}
