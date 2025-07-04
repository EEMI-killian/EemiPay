import "reflect-metadata";
import { AppDataSource } from "../../data-source";
import { UserRepository } from "./user.repository";
import { faker } from "@faker-js/faker";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

describe("happy path CRUD user repository", () => {
  let userRepo: UserRepository;

  beforeAll(async () => {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      userRepo = new UserRepository(AppDataSource.getRepository("User"));
    } catch (err) {
      console.error("Error during Data Source initialization", err);
      throw err;
    }
  });

  afterAll(async () => {
    try {
      await AppDataSource.destroy();
      console.log("Data Source has been destroyed!");
    } catch (err) {
      console.error("Error during Data Source destruction", err);
    }
  });

  test("insert a User", async () => {
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    const user = await userRepo.createUser(userData);

    console.log("User created successfully:", user);

    // Add assertions to verify the user was created correctly
    expect(user).toBeDefined();
    expect(user.firstName).toBe(userData.firstName);
    expect(user.lastName).toBe(userData.lastName);
    expect(user.email).toBe(userData.email);
    // Note: Don't assert password directly for security reasons
  });
});
