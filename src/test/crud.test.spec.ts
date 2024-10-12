import { randomUUID } from "crypto";

import { AuthenticationClient } from "../shared/client/client.authentication";
import { UserServiceClient } from "../user-service/client/user.client";
import { UserDto } from "../user-service/dto/user.dto";

const baseUrl = "http://localhost:3000/api";

const authenticationClient = new AuthenticationClient(baseUrl);
const userServiceClient = new UserServiceClient(
  baseUrl,
).withAuthenticationClient(authenticationClient);

const testUser = new UserDto(
  randomUUID(),
  "test@example.com",
  "password123",
  new Date("2023-01-01"),
  new Date("2023-01-01"),
);

describe("UserServiceClient CRUD operations", () => {
  test("should retrieve all users", async () => {
    const response = await userServiceClient.findAll();
    expect(response.data).toEqual([]);
  });

  test("should create a new user", async () => {
    const response = await userServiceClient.create(testUser);
    expect(response.data).toEqual(testUser);
  });

  test("should retrieve all users", async () => {
    const response = await userServiceClient.findAll();
    expect(response.data).toEqual([testUser]);
  });

  test("should retrieve user by id", async () => {
    const response = await userServiceClient.findById(testUser.id);
    expect(response.data).toEqual(testUser);
  });

  test("should update a user", async () => {
    const updatedUser = { ...testUser, email: "newemail@example.com" };
    const response = await userServiceClient.update(testUser.id, updatedUser);
    expect(response.data).toEqual(updatedUser);
  });

  test("should delete a user", async () => {
    const response = await userServiceClient.delete(testUser.id);
    expect(response.data).toEqual(testUser);
  });
});
