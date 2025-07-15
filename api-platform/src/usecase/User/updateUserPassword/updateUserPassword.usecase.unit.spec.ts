import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { IUserRepository } from "../../../repository/User/user.repository.interface";
import { faker } from "@faker-js/faker";
import {
  IUpdateUserPasswordUseCasePresenter,
  UpdateUserPasswordUseCase,
} from "./updateUserPassword.usecase";
import { IPasswordGateway } from "../../../gateway/password/password.gateway.interface";

describe("UpdateUserPasswordUseCase", () => {
  const mockedPresenter: IUpdateUserPasswordUseCasePresenter<
    unknown,
    unknown,
    unknown,
    unknown
  > = {
    success: async () => {
      return { success: true };
    },
    error: async (error: string) => {
      return { error };
    },
    notFound: async () => {
      return { error: "user not found" };
    },
    invalidPassword: async () => {
      return { error: "invalid password" };
    },
  };

  const mockedUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockedPasswordGateway: jest.Mocked<IPasswordGateway> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should be update the password", async () => {
    const userArgs = {
      id: faker.number.int(),
      inputOldPassword: faker.internet.password(),
      newPassword: faker.internet.password(),
    };
    mockedUserRepository.findById.mockResolvedValue({
      id: userArgs.id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: userArgs.inputOldPassword,
      isActive: true,
      createdAt: faker.date.past(),
    });
    mockedUserRepository.updatePassword.mockResolvedValue(null);
    mockedPasswordGateway.compare.mockResolvedValue(true);
    const uc = new UpdateUserPasswordUseCase(
      mockedUserRepository,
      mockedPresenter,
      mockedPasswordGateway,
    );
    const response = await uc.execute(userArgs);
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.updatePassword).toHaveBeenCalled();
    expect(response).toEqual({ success: true });
  });
  test("it should be not updated because is an invalid password", async () => {
    const userArgs = {
      id: faker.number.int(),
      inputOldPassword: faker.internet.password(),
      newPassword: faker.internet.password(),
    };
    mockedUserRepository.findById.mockResolvedValue({
      id: userArgs.id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: true,
      createdAt: faker.date.past(),
    });
    mockedPasswordGateway.compare.mockResolvedValue(false);
    const uc = new UpdateUserPasswordUseCase(
      mockedUserRepository,
      mockedPresenter,
      mockedPasswordGateway,
    );
    const response = await uc.execute(userArgs);
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.updatePassword).not.toHaveBeenCalled();
    expect(response).toEqual({ error: "invalid password" });
  });
  test("it should be not updated because the user is not found", async () => {
    const userArgs = {
      id: faker.number.int(),
      inputOldPassword: faker.internet.password(),
      newPassword: faker.internet.password(),
    };
    mockedUserRepository.findById.mockResolvedValue(null);
    const uc = new UpdateUserPasswordUseCase(
      mockedUserRepository,
      mockedPresenter,
      mockedPasswordGateway,
    );
    const response = await uc.execute(userArgs);
    expect(mockedUserRepository.findById).toHaveBeenCalled();
    expect(mockedUserRepository.updatePassword).not.toHaveBeenCalled();
    expect(response).toEqual({ error: "user not found" });
  });
});
