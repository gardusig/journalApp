import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { randomUUID } from "crypto";
import { UserServiceClient } from "user-service/client/user.client";
import { UserDto } from "user-service/server/user.dto";

describe("UserServiceClient CRUD operations", () => {
  let mock: MockAdapter;
  let client: UserServiceClient;
  let testUser: UserDto;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    client = new UserServiceClient();
    testUser = new UserDto(
      randomUUID(),
      "test@example.com",
      "password123",
      new Date("2023-01-01"),
      new Date("2023-01-01"),
    );
  });

  afterEach(() => {
    mock.reset();
  });

  test("should create a new user", async () => {
    const response = await client.create(testUser);
    expect(response.data).toEqual(testUser);
  });

  test("should retrieve all users", async () => {
    const response = await client.findAll();
    expect(response.data).toEqual([testUser]);
  });

  test("should retrieve user by id", async () => {
    const response = await client.findById(testUser.id);
    expect(response.data).toEqual(testUser);
  });

  test("should update a user", async () => {
    const updatedUser = { ...testUser, email: "newemail@example.com" };
    mock
      .onPut(`http://localhost:3000/api/user/${testUser.id}`)
      .reply(200, updatedUser);
    const response = await client.update(testUser.id, updatedUser);
    expect(response.data).toEqual(updatedUser);
  });

  test("should delete a user", async () => {
    mock.onDelete(`http://localhost:3000/api/user/${testUser.id}`).reply(204);
    const response = await client.delete(testUser.id);
    expect(response.data).toEqual(testUser);
  });
});
