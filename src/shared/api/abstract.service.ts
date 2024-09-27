import { Logger } from "@nestjs/common";

export interface DatabaseMethods<T> {
  findUnique(...args: any): Promise<T | null>;
  findMany(...args: any): Promise<T[]>;
  create(...args: any): Promise<T>;
  update(...args: any): Promise<T>;
  delete(...args: any): Promise<T>;
}

export abstract class AbstractService<T> {
  protected readonly logger = new Logger(AbstractService.name);
  protected readonly database: DatabaseMethods<T>;

  private readonly idKey: string;

  constructor(database: DatabaseMethods<T>, idKey: string) {
    this.database = database;
    this.idKey = idKey;
  }

  // Abstract method for creating an entity (to be implemented by subclass)
  abstract create(entity: T): Promise<T>;

  // Find an entity by ID
  async findById(id: string): Promise<T | null> {
    try {
      return await this.findBy(this.idKey, id);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // Find all entities
  async findAll(): Promise<T[]> {
    try {
      return await this.database.findMany();
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  // Find an entity by a specific key-value pair
  async findBy(key: string, value: any): Promise<T | null> {
    try {
      return await this.database.findUnique({
        where: { [key]: value },
      });
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // Find an entity by a where clause
  async findWhere(whereClause: Record<string, any>): Promise<T | null> {
    try {
      return await this.database.findUnique({
        where: whereClause,
      });
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // Update an entity by ID
  async update(id: string, entity: T): Promise<T | null> {
    try {
      return await this.database.update({
        where: { [this.idKey]: id },
        data: entity,
      });
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // Delete an entity by ID
  async delete(id: string): Promise<T | null> {
    try {
      return await this.database.delete({
        where: { [this.idKey]: id },
      });
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // Handle errors (logging)
  protected handleError(error: any): void {
    this.logger.error(
      `Database operation failed: ${error.message}`,
      error.stack,
    );
  }
}
