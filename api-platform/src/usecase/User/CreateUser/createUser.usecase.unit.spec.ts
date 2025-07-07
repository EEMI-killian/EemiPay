import { IUserRepository } from "../../../repository/User/user.repository.interface";
import {
  CreateUserUseCase,
  ICreateUserUseCasePresenter,
} from "./createUser.usecase";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";
import { UuidGateway } from "../../../gateway/uuid/uuid.gateway";

describe("CreateUserUseCase", () => {
  const mockedPresenter: ICreateUserUseCasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async (id: string) => {
      return { success: true, id };
    },
    error: async (error: string) => {
      return { error };
    },
    alreadyExists: async () => {
      return { error: "User already exist" };
    },
    invalidArguments: async () => {
      return { error: "Invalid arguments" };
    },
  };
  const mockedUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    updatePassword: jest.fn(),
  };
  const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const mockedPasswordGateway: jest.Mocked<IHashGateway> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockedUuidGateway: jest.Mocked<UuidGateway> = {
    generate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should create a user", async () => {
    const userId = faker.string.uuid();
    mockedUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockedUuidGateway.generate.mockResolvedValueOnce(userId);
    mockedUserRepository.findByEmail.mockResolvedValueOnce({
      id: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      isActive: false,
      createdAt: new Date(),
    });
    const uc = new CreateUserUseCase(
      mockedUserRepository,
      mockedPresenter,
      mockedPasswordGateway,
      mockedUuidGateway,
    );
    const response = await uc.execute(userData);
    expect(mockedUserRepository.create).toHaveBeenCalled();
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(2);
    expect(response).toEqual({ success: true, id: userId });
  });

  test("it should be return an error about a user who already exist", async () => {
    const userId = faker.string.uuid();
    mockedUuidGateway.generate.mockResolvedValueOnce(userId);
    mockedUserRepository.findByEmail.mockResolvedValueOnce({
      id: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      isActive: false,
      createdAt: new Date(),
    });
    const uc = new CreateUserUseCase(
      mockedUserRepository,
      mockedPresenter,
      mockedPasswordGateway,
      mockedUuidGateway,
    );
    const response = await uc.execute(userData);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalled();
    expect(mockedUserRepository.create).not.toHaveBeenCalled();
    expect(response).toEqual({ error: "User already exist" });
  });
});
